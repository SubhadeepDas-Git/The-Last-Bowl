import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  onTrackOrder?: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onTrackOrder }) => {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, subtotal, tax, total, totalItems } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !checkoutOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, checkoutOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-[var(--text-primary)]/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div 
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--bg-card)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label="Your Midnight Cart"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)]/70 flex items-center justify-between bg-[var(--bg-secondary)]/40">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[var(--text-primary)]" />
            <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-medium">
              Midnight Order
            </h2>
            <span className="text-xs bg-[var(--border-subtle)] text-[var(--text-primary)] font-semibold px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          </div>

          <button
            onClick={closeCart}
            type="button"
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-muted)] shadow-inner">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg text-[var(--text-primary)]">Your bowl is empty</h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                  The night is young and the broth is warm. Select a signature bowl or build your custom midnight recipe.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all"
              >
                Explore Signature Bowls
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.cartItemId} 
                className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]/70 space-y-3 transition-all hover:border-[var(--border-subtle)]"
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-[var(--border-subtle)]/60 shrink-0 bg-[var(--bg-secondary)]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-base text-[var(--text-primary)] truncate pr-2">
                        {item.name}
                      </h4>
                      <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.tag && (
                      <span className="inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]/50 mt-1">
                        {item.tag}
                      </span>
                    )}

                    {/* Custom Bowl details if custom */}
                    {item.isCustomBowl && item.customDetails && (
                      <div className="mt-2 text-[11px] text-[var(--text-secondary)] space-y-0.5 border-t border-[var(--border-subtle)]/40 pt-1.5 font-light">
                        <div><strong className="font-medium text-[var(--text-primary)]">Broth:</strong> {item.customDetails.broth}</div>
                        <div><strong className="font-medium text-[var(--text-primary)]">Noodles:</strong> {item.customDetails.noodles}</div>
                        <div><strong className="font-medium text-[var(--text-primary)]">Protein:</strong> {item.customDetails.protein}</div>
                        {item.customDetails.toppings.length > 0 && (
                          <div className="truncate">
                            <strong className="font-medium text-[var(--text-primary)]">Toppings:</strong> {item.customDetails.toppings.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity + Remove controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center border border-[var(--border-subtle)] rounded-full bg-[var(--bg-card)] p-0.5">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, -1)}
                      type="button"
                      className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors"
                      aria-label="Decrease item quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 text-xs font-semibold min-w-5 text-center text-[var(--text-primary)]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, 1)}
                      type="button"
                      className="p-1 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors"
                      aria-label="Increase item quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    type="button"
                    className="p-1.5 text-[var(--text-muted)] hover:text-rose-700 transition-colors"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 bg-[var(--bg-secondary)]/60 border-t border-[var(--border-subtle)] space-y-4">
            <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Dining Tax (8.25%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]/60 font-serif">
                <span>Estimated Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutOpen(true)}
              type="button"
              className="w-full py-3.5 px-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E98316]" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onTrackOrder={(orderId) => {
          setCheckoutOpen(false);
          closeCart();
          onTrackOrder?.(orderId);
        }}
      />
    </>
  );
};
