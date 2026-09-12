import React, { useEffect, useState } from 'react';
import { X, Flame, Leaf, Star, Plus, Minus, Check, Heart } from 'lucide-react';
import { MenuItem } from '../types';
import { useCart } from '../hooks/useCart';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);


  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [item, onClose]);

  if (!item) return null;

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      tag: item.tag
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[var(--text-primary)]/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-bowl-title"
    >
      <div 
        className="relative w-full max-w-2xl bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[var(--bg-card)]/80 hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Header & Image Layout */}
          <div className="relative rounded-xl overflow-hidden aspect-video sm:aspect-21/9 bg-[var(--bg-secondary)] border border-[var(--border-subtle)]/60 shadow-inner">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--text-primary)]/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Overlay Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-[var(--bg-card)]/95 text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]">
                {item.tag}
              </span>
              {item.isVegetarian && (
                <span className="px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shadow-sm border border-emerald-500/30">
                  <Leaf className="w-3 h-3" /> Vegetarian
                </span>
              )}
              {item.isHouseFavorite && (
                <span className="px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-semibold bg-[#E98316]/20 text-[#E98316] flex items-center gap-1 shadow-sm border border-[#E98316]/40">
                  <Star className="w-3 h-3 fill-current" /> House Favorite
                </span>
              )}
            </div>
          </div>

          {/* Title and Price */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)]/60 pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 id="modal-bowl-title" className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal">
                  {item.name}
                </h2>
                {item.japaneseName && (
                  <span className="font-serif text-sm tracking-widest text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
                    {item.japaneseName}
                  </span>
                )}
              </div>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-1">
                {item.brothType} · {item.noodleType}
              </p>
            </div>
            <div className="text-2xl font-serif text-[var(--text-primary)] font-semibold">
              ${item.price.toFixed(2)}
            </div>
          </div>

          {/* Story & Description */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-secondary)]">
              The Craft & Broth
            </h4>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-light">
              {item.longDescription || item.description}
            </p>
          </div>

          {/* Ingredients & Details Pills */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-secondary)]">
              Hand-Selected Ingredients
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ingredient) => (
                <span 
                  key={ingredient} 
                  className="px-3 py-1 rounded-lg text-xs bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)]/60"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Details Row: Spice & Allergens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)]/60">
              <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#E98316]" /> Spice Intensity
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((lvl) => (
                  <span 
                    key={lvl}
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      lvl <= item.spiceLevel 
                        ? 'bg-[#E98316] text-white' 
                        : 'bg-[var(--border-subtle)]/60 text-[var(--text-muted)]'
                    }`}
                  >
                    {lvl === 1 ? 'Mild' : lvl === 2 ? 'Medium' : 'Fiery'}
                  </span>
                ))}
                {item.spiceLevel === 0 && (
                  <span className="text-xs text-[var(--text-muted)] italic">Gentle & Non-Spicy</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)]/60">
              <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[var(--text-secondary)]" /> Allergen Information
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                {item.allergens && item.allergens.length > 0
                  ? item.allergens.join(', ')
                  : 'No common nut or seafood allergens declared.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[var(--bg-secondary)]/50 border-t border-[var(--border-subtle)] flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center border border-[var(--border-subtle)] rounded-full bg-[var(--bg-card)] p-1 shadow-xs">
            <button
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              type="button"
              className="p-1.5 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors focus:outline-none"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-sm font-semibold min-w-6 text-center text-[var(--text-primary)]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(prev => prev + 1)}
              type="button"
              className="p-1.5 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors focus:outline-none"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            type="button"
            className={`flex-1 py-3 px-6 rounded-full font-medium tracking-widest text-xs uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:opacity-90 hover:shadow-md'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Added to Midnight Order</span>
              </>
            ) : (
              <span>Add to Order — ${(item.price * quantity).toFixed(2)}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
