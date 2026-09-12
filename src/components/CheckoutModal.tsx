import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Sparkles, MapPin, Truck, Store } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { OrderType, Order } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { useRestaurantStatus } from '../hooks/useRestaurantStatus';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose,
  onTrackOrder 
}) => {
  const { cart, subtotal, tax, clearCart } = useCart();
  const { currentUser } = useAuth();
  const restaurantStatus = useRestaurantStatus();

  const [orderType, setOrderType] = useState<OrderType>('DELIVERY');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [pickupTime, setPickupTime] = useState('20-25 mins');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [instructions, setInstructions] = useState('');

  // Delivery Address fields
  const [houseFlat, setHouseFlat] = useState(currentUser?.addresses?.[0]?.houseFlat || '');
  const [street, setStreet] = useState(currentUser?.addresses?.[0]?.street || '');
  const [area, setArea] = useState(currentUser?.addresses?.[0]?.area || '');
  const [city, setCity] = useState(currentUser?.addresses?.[0]?.city || 'Nightfall Quarter');
  const [stateVal, setStateVal] = useState(currentUser?.addresses?.[0]?.state || 'NQ');
  const [pinCode, setPinCode] = useState(currentUser?.addresses?.[0]?.pinCode || '700012');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync with current user if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      if (currentUser.addresses && currentUser.addresses.length > 0) {
        const def = currentUser.addresses[0];
        setHouseFlat(def.houseFlat);
        setStreet(def.street);
        setArea(def.area);
        setCity(def.city);
        setStateVal(def.state);
        setPinCode(def.pinCode);
      }
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const deliveryFee = orderType === 'DELIVERY' ? 3.50 : 0.00;
  const tipAmount = (subtotal * tipPercent) / 100;
  const finalTotal = subtotal + deliveryFee + tax + tipAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newOrder = await orderService.createOrder({
        userId: currentUser?.id,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: [...cart],
        subtotal,
        deliveryFee,
        tax,
        tip: tipAmount,
        total: finalTotal,
        orderType,
        deliveryAddress: orderType === 'DELIVERY' ? {
          houseFlat,
          street,
          area,
          city,
          state: stateVal,
          pinCode
        } : undefined,
        pickupTime: orderType === 'PICKUP' ? pickupTime : undefined,
        specialInstructions: instructions
      });

      setConfirmedOrder(newOrder);
      setIsSubmitting(false);
      clearCart();

      // Gentle celebratory confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFDAC1', '#B2A4FF', '#E98316', '#7CAFD1']
        });
      } catch (err) {
        console.log(err);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--text-primary)]/65 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleResetAndClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="p-8 sm:p-10 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#E98316] font-semibold">
                Order Received & Verified
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)]">
                {confirmedOrder.orderType === 'DELIVERY' 
                  ? 'Your bowl is on its way.' 
                  : 'Your bowl is waiting at the counter.'}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto font-light">
                {confirmedOrder.orderType === 'DELIVERY'
                  ? 'Our courier is setting off into the neon night. You can track each stage live.'
                  : 'Broth is simmering and packed fresh. Visit Midnight Alley when you are ready.'}
              </p>
            </div>

            {/* Ticket Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                <span className="text-[var(--text-muted)]">ORDER ID</span>
                <span className="font-bold text-[var(--text-primary)] text-sm">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                <span className="text-[var(--text-muted)]">ORDER TYPE</span>
                <span className="font-semibold text-[var(--text-primary)]">{confirmedOrder.orderType}</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                <span className="text-[var(--text-muted)]">ESTIMATED TIME</span>
                <span className="font-bold text-[#E98316]">{confirmedOrder.estimatedDeliveryTime}</span>
              </div>
              {confirmedOrder.deliveryAddress && (
                <div className="flex justify-between border-b border-[var(--border-subtle)]/60 pb-2">
                  <span className="text-[var(--text-muted)]">DELIVERY ADDRESS</span>
                  <span className="text-[var(--text-primary)] text-right">
                    {confirmedOrder.deliveryAddress.houseFlat}, {confirmedOrder.deliveryAddress.street}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-[var(--text-muted)]">TOTAL CHARGED</span>
                <span className="font-bold text-[var(--text-primary)]">${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {onTrackOrder && (
                <button
                  onClick={() => {
                    const id = confirmedOrder.id;
                    handleResetAndClose();
                    onTrackOrder(id);
                  }}
                  type="button"
                  className="flex-1 py-3.5 rounded-full bg-[#E98316] text-white text-xs uppercase tracking-widest font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Clock className="w-4 h-4" />
                  <span>Track Order</span>
                </button>
              )}

              <button
                onClick={handleResetAndClose}
                type="button"
                className="flex-1 py-3.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all"
              >
                Back to The Retreat
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden text-left">
            
            {/* Header with Type Selector */}
            <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)]/60 bg-[var(--bg-secondary)]/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold block">
                    Midnight Service
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal mt-0.5">
                    Order Checkout
                  </h3>
                </div>

                {/* Delivery vs Pickup Toggle */}
                <div className="p-1 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center">
                  <button
                    type="button"
                    onClick={() => setOrderType('DELIVERY')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                      orderType === 'DELIVERY'
                        ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Truck className="w-3 h-3" />
                    <span>Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('PICKUP')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                      orderType === 'PICKUP'
                        ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Store className="w-3 h-3" />
                    <span>Pickup</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              
              {/* Order Items Preview */}
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold">
                  Items ({cart.length})
                </div>
                <div className="max-h-36 overflow-y-auto divide-y divide-[var(--border-subtle)]/50 border border-[var(--border-subtle)]/70 rounded-2xl bg-[var(--bg-secondary)] p-3">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="py-2 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                        <span className="text-[var(--text-muted)] ml-2">× {item.quantity}</span>
                      </div>
                      <span className="font-mono text-[var(--text-primary)]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup info OR Delivery Address */}
              {orderType === 'PICKUP' ? (
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#E98316] shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-serif font-bold text-[var(--text-primary)] block">
                        Pickup Location: {RESTAURANT_INFO.location.address}
                      </span>
                      <span className="text-[var(--text-secondary)]">{RESTAURANT_INFO.location.subtext}</span>
                      <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">Hours: {RESTAURANT_INFO.hours.display}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-1.5">
                      Ready In
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['15-20 mins', '25-30 mins', '40-45 mins'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPickupTime(slot)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                            pickupTime === slot
                              ? 'border-[#E98316] bg-[#E98316] text-white shadow-xs'
                              : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Delivery Address Form */
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold block">
                    Midnight Delivery Destination
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={houseFlat}
                        onChange={(e) => setHouseFlat(e.target.value)}
                        placeholder="House / Flat / Apt No. *"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Street / Lane *"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Area / District"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                    />
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="PIN Code *"
                      className="w-full px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                    />
                  </div>
                </div>
              )}

              {/* Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ren"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Phone (Delivery Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nightretreat.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                />
              </div>

              {/* Tip Selection */}
              <div>
                <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold block mb-2">
                  Kitchen Gratitude Tip
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTipPercent(pct)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                        tipPercent === pct
                          ? 'border-[var(--btn-primary-bg)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      {pct === 0 ? 'No Tip' : `${pct}% ($${((subtotal * pct) / 100).toFixed(2)})`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Special Kitchen Notes (Optional)
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Leave package at side gate, extra chili on side, etc."
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[#E98316]"
                />
              </div>

              {/* Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-xs text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono">{deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free (Pickup)'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (8.25%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                {tipPercent > 0 && (
                  <div className="flex justify-between">
                    <span>Kitchen Tip ({tipPercent}%)</span>
                    <span className="font-mono">${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)] font-serif">
                  <span>Total Due</span>
                  <span className="font-mono font-bold">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Closed Kitchen Warning */}
              {!restaurantStatus.isOpen && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-3">
                  <Store className="w-5 h-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="font-semibold text-xs">The kitchen is resting. Come back after dark.</p>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Online ordering is paused. Doors open at 7:00 PM.</p>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Place Order CTA */}
            <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/60 border-t border-[var(--border-subtle)]">
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0 || !restaurantStatus.isOpen}
                className="w-full py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Sending Order to Kitchen...</span>
                ) : !restaurantStatus.isOpen ? (
                  <span>Kitchen Resting (Closed)</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#E98316]" />
                    <span>Place Order · ${finalTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
