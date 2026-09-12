import React, { useState } from 'react';
import { 
  X, User as UserIcon, Package, Calendar, MapPin, 
  Settings, LogOut, Clock, 
  RotateCcw, CheckCircle2, AlertTriangle, Trash2, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import { reservationService } from '../services/reservationService';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Order, Reservation, UserAddress } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  onTrackOrder: (orderId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'orders',
  onTrackOrder
}) => {
  const { currentUser, logout, updateProfile } = useAuth();
  const { addToCart, openCart } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<Order[]>(() => orderService.getOrders(currentUser?.id));
  const [reservations, setReservations] = useState<Reservation[]>(() => reservationService.getReservations(currentUser?.id));
  
  // Edit Profile form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Address form state
  const [newHouse, setNewHouse] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPin, setNewPin] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Cancellation confirm modal state
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  const handleRefreshData = () => {
    setOrders(orderService.getOrders(currentUser.id));
    setReservations(reservationService.getReservations(currentUser.id));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName.trim(),
      phone: editPhone.trim()
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2000);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        tag: item.tag,
        isCustomBowl: item.isCustomBowl,
        customDetails: item.customDetails
      });
    });
    onClose();
    openCart();
  };

  const handleConfirmCancelReservation = async () => {
    if (!cancelReservationId) return;
    await reservationService.cancelReservation(cancelReservationId);
    setCancelReservationId(null);
    handleRefreshData();
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse || !newStreet) return;
    const newAddr: UserAddress = {
      id: `addr_${Date.now()}`,
      label: 'Saved Address',
      houseFlat: newHouse.trim(),
      street: newStreet.trim(),
      area: newArea.trim() || 'Neon District',
      city: newCity.trim() || 'Nightfall Quarter',
      state: 'NQ',
      pinCode: newPin.trim() || '700012'
    };

    const updatedAddresses = [...(currentUser.addresses || []), newAddr];
    await updateProfile({ addresses: updatedAddresses });
    setShowAddAddress(false);
    setNewHouse('');
    setNewStreet('');
    setNewArea('');
    setNewCity('');
    setNewPin('');
  };

  const handleDeleteAddress = async (id: string) => {
    const updated = (currentUser.addresses || []).filter(a => a.id !== id);
    await updateProfile({ addresses: updated });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--text-primary)]/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-3xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 bg-[var(--bg-secondary)] border-b md:border-b-0 md:border-r border-[var(--border-subtle)] p-6 flex flex-col justify-between shrink-0">
          
          <div className="space-y-6">
            {/* User Avatar & Name */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-base text-[var(--text-primary)] font-medium truncate">
                  {currentUser.name}
                </h3>
                <span className="text-[11px] text-[var(--text-muted)] truncate block">
                  {currentUser.email}
                </span>
                <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#E98316]/15 text-[#E98316]">
                  {currentUser.role}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-1.5" aria-label="Profile navigation">
              {[
                { id: 'orders', label: 'My Orders', icon: <Package className="w-4 h-4" />, count: orders.length },
                { id: 'reservations', label: 'My Reservations', icon: <Calendar className="w-4 h-4" />, count: reservations.length },
                { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" />, count: currentUser.addresses?.length || 0 },
                { id: 'preferences', label: 'Preferences & Theme', icon: <Settings className="w-4 h-4" /> },
                { id: 'edit', label: 'Edit Profile', icon: <UserIcon className="w-4 h-4" /> },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[var(--border-subtle)] text-[var(--text-primary)]">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="pt-6 border-t border-[var(--border-subtle)]/60">
            <button
              onClick={logout}
              type="button"
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* Right Tab Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header Bar */}
          <div className="p-6 border-b border-[var(--border-subtle)]/60 flex items-center justify-between">
            <h4 className="font-serif text-xl text-[var(--text-primary)] font-medium">
              {activeTab === 'orders' && 'Order History'}
              {activeTab === 'reservations' && 'Table Reservations'}
              {activeTab === 'addresses' && 'Delivery Addresses'}
              {activeTab === 'preferences' && 'Dining & Theme Preferences'}
              {activeTab === 'edit' && 'Account Settings'}
            </h4>

            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* TAB 1: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Package className="w-10 h-10 mx-auto text-[var(--text-muted)] opacity-40" />
                    <h5 className="font-serif text-base text-[var(--text-primary)]">You haven't ordered a bowl yet</h5>
                    <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                      Explore our signature ramen broths and order hot comfort to your doorstep.
                    </p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)]/60 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                              {order.id}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                              order.status === 'active' 
                                ? 'bg-amber-500/15 text-amber-700' 
                                : order.status === 'completed' 
                                  ? 'bg-emerald-500/15 text-emerald-700' 
                                  : 'bg-red-500/15 text-red-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {order.orderType}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-base font-bold text-[var(--text-primary)]">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.quantity}× {item.name}</span>
                            <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border-subtle)]/40">
                        <button
                          onClick={() => { onClose(); onTrackOrder(order.id); }}
                          type="button"
                          className="px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-primary)] flex items-center gap-1 transition-colors"
                        >
                          <Clock className="w-3 h-3 text-[#E98316]" />
                          <span>Track Order</span>
                        </button>

                        <button
                          onClick={() => handleReorder(order)}
                          type="button"
                          className="px-3.5 py-1.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-[11px] uppercase tracking-wider font-medium hover:opacity-90 flex items-center gap-1 transition-all"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reorder</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: MY RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Calendar className="w-10 h-10 mx-auto text-[var(--text-muted)] opacity-40" />
                    <h5 className="font-serif text-base text-[var(--text-primary)]">No midnight plans yet</h5>
                    <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                      Reserve a table under the lantern light to experience our unhurried late-night dining.
                    </p>
                  </div>
                ) : (
                  reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3"
                    >
                      <div className="flex justify-between items-start border-b border-[var(--border-subtle)]/60 pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[var(--text-primary)]">{res.id}</span>
                            <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                              res.status === 'upcoming' 
                                ? 'bg-emerald-500/15 text-emerald-700' 
                                : res.status === 'completed' 
                                  ? 'bg-blue-500/15 text-blue-700' 
                                  : 'bg-red-500/15 text-red-700'
                            }`}>
                              {res.status}
                            </span>
                          </div>
                          <p className="font-serif text-sm font-medium text-[var(--text-primary)] mt-1">
                            {res.tableName || res.seatingPreference} · {res.guests} Guests
                          </p>
                        </div>

                        <div className="text-right text-xs">
                          <span className="font-semibold text-[var(--text-primary)] block">{res.date}</span>
                          <span className="text-[#E98316] font-medium">{res.time}</span>
                        </div>
                      </div>

                      {res.specialRequest && (
                        <p className="text-[11px] text-[var(--text-secondary)] italic">
                          Notes: “{res.specialRequest}”
                        </p>
                      )}

                      {/* Cancel Action if upcoming */}
                      {res.status === 'upcoming' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setCancelReservationId(res.id)}
                            className="px-3 py-1 rounded-full text-[11px] font-medium text-red-600 hover:bg-red-500/10 border border-red-300/40 transition-colors"
                          >
                            Cancel Reservation
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[var(--text-secondary)]">Your saved delivery destinations</span>
                  <button
                    onClick={() => setShowAddAddress(prev => !prev)}
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#E98316] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3">
                    <h5 className="font-serif text-sm text-[var(--text-primary)]">New Address</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="House / Flat / Apt *"
                        value={newHouse}
                        onChange={(e) => setNewHouse(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Street *"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Area / Neighborhood"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="PIN Code"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase font-medium"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {(currentUser.addresses || []).length === 0 && !showAddAddress ? (
                  <p className="text-xs text-[var(--text-muted)] text-center py-6">No saved addresses yet.</p>
                ) : (
                  (currentUser.addresses || []).map((addr) => (
                    <div key={addr.id} className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-[var(--text-primary)] block">{addr.label}</span>
                        <span className="text-[var(--text-secondary)]">{addr.houseFlat}, {addr.street}, {addr.area}, {addr.city} {addr.pinCode}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        type="button"
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: PREFERENCES & THEME */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] block">
                    Global Atmosphere Theme
                  </span>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Switch between our warm Light retreat, dark midnight at 1 AM, and dreamy Pastel serenity.
                  </p>
                  <ThemeSwitcher variant="pill" />
                </div>

                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] block">
                    Dining Philosophy
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    “A Cozy Ramen Retreat After Dark. We believe comfort food should be as comforting as the night itself.”
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: EDIT PROFILE */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-sm text-[var(--text-muted)] cursor-not-allowed"
                  />
                </div>

                {profileSavedMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-300/40 text-emerald-700 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile settings updated successfully.</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* Cancel Reservation Confirmation Modal Overlay */}
        {cancelReservationId && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-subtle)] max-w-sm w-full space-y-4 shadow-2xl text-center">
              <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
              <h5 className="font-serif text-lg text-[var(--text-primary)]">
                Cancel this reservation?
              </h5>
              <p className="text-xs text-[var(--text-secondary)]">
                Are you sure you want to cancel booking <strong>{cancelReservationId}</strong>? Your reserved table will be released for other midnight guests.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setCancelReservationId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] text-[var(--text-primary)]"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelReservation}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
