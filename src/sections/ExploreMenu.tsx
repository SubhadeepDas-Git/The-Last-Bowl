import React, { useState } from 'react';
import { Eye, Plus, Flame, Leaf, Star } from 'lucide-react';
import { ALL_MENU_ITEMS } from '../data/menuData';
import { MenuItem, RamenCategory } from '../types';
import { useCart } from '../hooks/useCart';

interface ExploreMenuProps {
  onSelectItem: (item: MenuItem) => void;
}

export const ExploreMenu: React.FC<ExploreMenuProps> = ({ onSelectItem }) => {
  const [activeCategory, setActiveCategory] = useState<RamenCategory>('all');
  const { addToCart } = useCart();

  const categories: { id: RamenCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'house-favorite', label: 'House Favorite' },
    { id: 'classic', label: 'Classic' },
    { id: 'rich-creamy', label: 'Rich & Creamy' },
    { id: 'spicy', label: 'Spicy' },
    { id: 'hearty', label: 'Hearty' },
    { id: 'vegetarian', label: 'Vegetarian' },
  ];

  const filteredItems = ALL_MENU_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'house-favorite') return item.isHouseFavorite;
    if (activeCategory === 'vegetarian') return item.isVegetarian;
    return item.category === activeCategory;
  });

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
    <section id="menu-explore" className="py-20 md:py-32 relative bg-[var(--bg-secondary)]/30 border-t border-[var(--border-subtle)]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
            CULINARY ARCHIVE
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
            Explore the Menu
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light">
            Filter our late-night selection by palate preference, dietary requirements, or spice tolerance.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="night-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group p-5 bg-[var(--bg-card)] border border-[var(--border-subtle)]"
            >
              <div>
                {/* Image Aspect Box */}
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-[var(--bg-secondary)] mb-4 border border-[var(--border-subtle)]/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Badge */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold bg-[var(--bg-card)]/95 text-[var(--text-primary)] border border-[var(--border-subtle)]">
                      {item.tag}
                    </span>
                    {item.isVegetarian && (
                      <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400" title="Vegetarian">
                        <Leaf className="w-2.5 h-2.5" />
                      </span>
                    )}
                    {item.isHouseFavorite && (
                      <span className="p-1 rounded-full bg-amber-500/20 text-amber-500" title="House Favorite">
                        <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Price */}
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="font-serif text-xl text-[var(--text-primary)] font-medium group-hover:text-amber-500 transition-colors truncate">
                    {item.name}
                  </h3>
                  <span className="font-serif text-lg text-[var(--text-primary)] font-semibold">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-4 font-light">
                  {item.description}
                </p>

                {/* Ingredients snippet */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.ingredients.slice(0, 3).map((ing) => (
                    <span 
                      key={ing} 
                      className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    >
                      {ing}
                    </span>
                  ))}
                  {item.ingredients.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">
                      +{item.ingredients.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[var(--border-subtle)]/50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
                  {item.spiceLevel > 0 ? (
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Flame className="w-3 h-3" />
                      <span>Spice {item.spiceLevel}/3</span>
                    </span>
                  ) : (
                    <span>Mild / Comfort</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] flex items-center gap-1 font-medium">
                    <Eye className="w-3 h-3" /> Details
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(e, item)}
                    type="button"
                    className="p-1.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] transition-colors cursor-pointer"
                    title="Add to order"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
