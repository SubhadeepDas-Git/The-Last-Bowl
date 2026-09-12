import React, { useState } from 'react';
import { Check, ShoppingBag, RotateCcw } from 'lucide-react';
import { 
  BASE_BOWL_PRICE, 
  BROTH_OPTIONS, 
  NOODLE_OPTIONS, 
  PROTEIN_OPTIONS, 
  TOPPING_OPTIONS, 
  EXTRA_OPTIONS 
} from '../data/customizationData';
import { BrothOption, NoodleOption, ProteinOption } from '../types';
import { useCart } from '../hooks/useCart';

export const BuildYourBowl: React.FC = () => {
  const { addToCart } = useCart();

  const [selectedBroth, setSelectedBroth] = useState<BrothOption>(BROTH_OPTIONS[0]);
  const [selectedNoodles, setSelectedNoodles] = useState<NoodleOption>(NOODLE_OPTIONS[1]);
  const [selectedProtein, setSelectedProtein] = useState<ProteinOption>(PROTEIN_OPTIONS[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>(['ajitama', 'scallions', 'corn']);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Toggle topping
  const toggleTopping = (id: string) => {
    setSelectedToppings(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Toggle extra
  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  // Reset to default
  const handleReset = () => {
    setSelectedBroth(BROTH_OPTIONS[0]);
    setSelectedNoodles(NOODLE_OPTIONS[1]);
    setSelectedProtein(PROTEIN_OPTIONS[0]);
    setSelectedToppings(['ajitama', 'scallions', 'corn']);
    setSelectedExtras([]);
    setSpiceLevel(1);
  };

  // Calculate pricing
  const additionsPrice = 
    selectedBroth.additionalPrice +
    selectedProtein.additionalPrice +
    selectedToppings.reduce((sum, id) => {
      const top = TOPPING_OPTIONS.find(t => t.id === id);
      return sum + (top ? top.additionalPrice : 0);
    }, 0) +
    selectedExtras.reduce((sum, id) => {
      const ext = EXTRA_OPTIONS.find(e => e.id === id);
      return sum + (ext ? ext.price : 0);
    }, 0);

  const totalPrice = BASE_BOWL_PRICE + additionsPrice;

  const handleAddCustomBowlToCart = () => {
    const toppingNames = selectedToppings.map(id => TOPPING_OPTIONS.find(t => t.id === id)?.name || id);
    const extraNames = selectedExtras.map(id => EXTRA_OPTIONS.find(e => e.id === id)?.name || id);

    addToCart({
      name: `Custom Midnight Bowl (${selectedBroth.name})`,
      price: totalPrice,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop',
      tag: 'BESPOKE CREATION',
      isCustomBowl: true,
      customDetails: {
        broth: selectedBroth.name,
        noodles: selectedNoodles.name,
        protein: selectedProtein.name,
        toppings: toppingNames,
        extras: extraNames,
        spiceLevel
      }
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <section id="build-bowl" className="py-20 md:py-32 relative bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
            BESPOKE MIDNIGHT CRAFT
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
            Build Your Bowl
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light">
            Craft your custom midnight recipe. Choose your broth foundation, noodle bite, protein, and house toppings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Customizer Options (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-10 text-left">
            
            {/* 1. Broth Foundation */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-xl text-[var(--text-primary)]">
                  1. Broth Foundation
                </h3>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  Slow-simmered
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BROTH_OPTIONS.map((broth) => (
                  <button
                    key={broth.id}
                    onClick={() => setSelectedBroth(broth)}
                    type="button"
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBroth.id === broth.id
                        ? 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xs ring-1 ring-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[var(--text-primary)]">{broth.name}</span>
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {broth.additionalPrice > 0 ? `+$${broth.additionalPrice.toFixed(2)}` : 'Included'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-1">{broth.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Noodles Firmness & Cut */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-xl text-[var(--text-primary)]">
                  2. Noodle Cut & Texture
                </h3>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">
                  Daily Kneaded
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {NOODLE_OPTIONS.map((noodle) => (
                  <button
                    key={noodle.id}
                    onClick={() => setSelectedNoodles(noodle)}
                    type="button"
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedNoodles.id === noodle.id
                        ? 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xs ring-1 ring-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <div className="font-medium text-xs sm:text-sm text-[var(--text-primary)] truncate">{noodle.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1">{noodle.firmness}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Protein Selection */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-xl text-[var(--text-primary)]">
                  3. Centerpiece Protein
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROTEIN_OPTIONS.map((prot) => (
                  <button
                    key={prot.id}
                    onClick={() => setSelectedProtein(prot)}
                    type="button"
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedProtein.id === prot.id
                        ? 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xs ring-1 ring-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <span className="font-medium text-xs sm:text-sm text-[var(--text-primary)]">{prot.name}</span>
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {prot.additionalPrice > 0 ? `+$${prot.additionalPrice.toFixed(2)}` : '$0'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Artisanal Toppings (Multi-Select) */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-xl text-[var(--text-primary)]">
                  4. Fresh Toppings & Accents
                </h3>
                <span className="text-xs text-[var(--text-muted)]">Select as many as you crave</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TOPPING_OPTIONS.map((top) => {
                  const isSelected = selectedToppings.includes(top.id);
                  return (
                    <button
                      key={top.id}
                      onClick={() => toggleTopping(top.id)}
                      type="button"
                      className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] font-medium ring-1 ring-[var(--text-primary)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className="text-xs text-[var(--text-primary)] pr-4">{top.name}</div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)]">
                        +${top.additionalPrice.toFixed(2)}
                      </div>
                      {isSelected && (
                        <Check className="w-3 h-3 text-[var(--text-primary)] absolute top-2 right-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Extras & Upgrades */}
            <div className="space-y-3">
              <h3 className="font-serif text-xl text-[var(--text-primary)]">
                5. Midnight Extras
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXTRA_OPTIONS.map((ext) => {
                  const isSelected = selectedExtras.includes(ext.id);
                  return (
                    <button
                      key={ext.id}
                      onClick={() => toggleExtra(ext.id)}
                      type="button"
                      className={`p-2.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] font-medium ring-1 ring-[var(--text-primary)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className="text-xs text-[var(--text-primary)] pr-4">{ext.name}</div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)]">
                        +${ext.price.toFixed(2)}
                      </div>
                      {isSelected && (
                        <Check className="w-3 h-3 text-[var(--text-primary)] absolute top-2 right-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Live Bowl Preview & Sticky Order Summary (Right 5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Visual Interactive Bowl Representation */}
            <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-lg text-center relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-semibold">
                  Live Recipe Preview
                </span>
                <button
                  onClick={handleReset}
                  type="button"
                  className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Stylized Bowl Graphic */}
              <div className="relative w-56 h-56 mx-auto my-3 flex items-center justify-center">
                {/* Ceramic Bowl Rim */}
                <div className="w-52 h-52 rounded-full border-4 border-[var(--border-subtle)] bg-[#2D241F] shadow-xl relative overflow-hidden flex items-center justify-center">
                  
                  {/* Dynamic Broth Color */}
                  <div 
                    className="w-44 h-44 rounded-full transition-colors duration-500 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: selectedBroth.color }}
                  >
                    {/* Broth oil shimmer */}
                    <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/30 pointer-events-none" />

                    {/* Noodle texture representation */}
                    <div className="absolute inset-2 border-2 border-dashed border-white/25 rounded-full animate-spin-slow opacity-60" style={{ animationDuration: '40s' }} />

                    {/* Center Protein indicator */}
                    <div className="w-16 h-16 rounded-full bg-[var(--bg-card)]/90 backdrop-blur-xs border border-[var(--border-subtle)] flex items-center justify-center p-1 text-center shadow-md z-10">
                      <span className="text-[9px] font-serif font-bold text-[var(--text-primary)] leading-tight line-clamp-2">
                        {selectedProtein.name.split(' ')[0]}
                      </span>
                    </div>

                    {/* Surrounding toppings dots */}
                    {selectedToppings.slice(0, 4).map((tId, idx) => {
                      const angles = [0, 90, 180, 270];
                      const angle = angles[idx];
                      const rad = (angle * Math.PI) / 180;
                      const x = Math.cos(rad) * 48;
                      const y = Math.sin(rad) * 48;
                      return (
                        <div
                          key={tId}
                          className="absolute w-5 h-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[8px] flex items-center justify-center font-bold text-[var(--text-primary)] shadow-xs"
                          style={{ transform: `translate(${x}px, ${y}px)` }}
                        >
                          ✦
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Steam whisps */}
                <div className="absolute -top-4 pointer-events-none opacity-60 flex gap-4">
                  <div className="w-4 h-12 bg-gradient-to-t from-white/40 to-transparent rounded-full filter blur-xs animate-steam-1" />
                  <div className="w-5 h-14 bg-gradient-to-t from-white/30 to-transparent rounded-full filter blur-xs animate-steam-2" />
                </div>
              </div>

              {/* Recipe Breakdown Pills */}
              <div className="text-xs text-[var(--text-secondary)] space-y-1.5 pt-2 border-t border-[var(--border-subtle)]/60 text-left">
                <div><strong className="text-[var(--text-primary)]">Broth:</strong> {selectedBroth.name}</div>
                <div><strong className="text-[var(--text-primary)]">Noodles:</strong> {selectedNoodles.name}</div>
                <div><strong className="text-[var(--text-primary)]">Protein:</strong> {selectedProtein.name}</div>
                <div><strong className="text-[var(--text-primary)]">Toppings ({selectedToppings.length}):</strong> {selectedToppings.map(id => TOPPING_OPTIONS.find(t => t.id === id)?.name).join(', ')}</div>
              </div>

              {/* Formula & Price Calculation as per user prompt:
                  BASE PRICE + ADDITIONS = TOTAL */}
              <div className="mt-5 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-xs font-mono text-[var(--text-secondary)] text-left">
                <div className="flex justify-between">
                  <span>BASE PRICE</span>
                  <span>${BASE_BOWL_PRICE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>+ ADDITIONS</span>
                  <span>+${additionsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[var(--text-primary)] pt-2 border-t border-[var(--border-subtle)]/60">
                  <span>= TOTAL</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Add Custom Bowl to Cart Action */}
              <div className="mt-5">
                <button
                  onClick={handleAddCustomBowlToCart}
                  type="button"
                  className={`w-full py-4 rounded-full font-medium tracking-widest text-xs uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] hover:shadow-md'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Custom Bowl Added to Order!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                      <span>Add Custom Bowl to Order · ${totalPrice.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
