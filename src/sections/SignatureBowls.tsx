import React from 'react';
import { Sparkles, Plus, Eye, Flame, Leaf } from 'lucide-react';
import { SIGNATURE_BOWLS } from '../data/menuData';
import { MenuItem } from '../types';
import { useCart } from '../hooks/useCart';

interface SignatureBowlsProps {
  onSelectItem: (item: MenuItem) => void;
}

export const SignatureBowls: React.FC<SignatureBowlsProps> = ({ onSelectItem }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      tag: item.tag
    });
  };

  return (
    <section id="signature-bowls" className="py-20 md:py-32 relative bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with exact reference labels */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] font-semibold text-[var(--text-muted)]">
            SERVED WARM, AFTER DARK
          </div>
          
          <h2 className="font-serif text-4xl sm:text-6xl text-[var(--text-primary)] font-normal tracking-tight">
            Signature Bowls
          </h2>

          <div className="text-xs tracking-[0.2em] font-medium text-[var(--text-secondary)] uppercase">
            LATE NIGHT BOWL · RAMEN MENU
          </div>

          <div className="w-12 h-[1px] bg-[var(--border-subtle)] mx-auto mt-4" />
        </div>

        {/* Editorial Menu Arrangement (2 columns of 3, with clean dividers, generous spacing, elegant typography) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 lg:gap-y-14">
          {SIGNATURE_BOWLS.map((bowl, index) => (
            <article
              key={bowl.id}
              onClick={() => onSelectItem(bowl)}
              className="group cursor-pointer flex flex-col justify-between p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-subtle)]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]"
              tabIndex={0}
              role="button"
              aria-label={`View details for ${bowl.name}`}
            >
              <div>
                {/* Top Row: Tag, Japanese name, and Index */}
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)]/60">
                      {bowl.tag}
                    </span>
                    {bowl.isVegetarian && (
                      <span className="text-emerald-500 flex items-center text-[11px]" title="Plant-based">
                        <Leaf className="w-3 h-3" />
                      </span>
                    )}
                    {bowl.spiceLevel > 0 && (
                      <span className="text-amber-500 flex items-center text-[11px]" title={`Spice level: ${bowl.spiceLevel}`}>
                        <Flame className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <span className="font-serif text-xs text-[var(--text-muted)] tracking-widest">
                    {bowl.japaneseName || `0${index + 1}`}
                  </span>
                </div>

                {/* Dish Name, Dot Leader Divider, and Price */}
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] group-hover:text-amber-500 transition-colors font-medium">
                    {bowl.name}
                  </h3>
                  
                  {/* Subtle dotted connector on desktop */}
                  <div className="hidden sm:block flex-1 border-b border-dotted border-[var(--border-subtle)]/80 relative -top-1" />

                  <span className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-semibold">
                    ${bowl.price}
                  </span>
                </div>

                {/* Dish Description from Prompt */}
                <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
                  {bowl.description}
                </p>
              </div>

              {/* Action Bar (View details / Quick order) */}
              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)]/40 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider text-[11px]">View Craft & Ingredients</span>
                </span>

                <button
                  onClick={(e) => handleQuickAdd(e, bowl)}
                  type="button"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-[11px] uppercase tracking-wider font-medium hover:bg-[var(--btn-primary-hover)] transition-all shadow-xs active:scale-95 cursor-pointer"
                  title="Add bowl to order"
                >
                  <Plus className="w-3 h-3" />
                  <span>Order Bowl</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Note on Midnight Customization */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)]/80 shadow-xs">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Craving something tailored to your late-night mood?
            </span>
            <a
              href="#build-bowl"
              className="text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] underline underline-offset-4 hover:text-amber-500 transition-colors"
            >
              Build Your Own Custom Bowl →
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
