import React, { useState } from 'react';
import { Sparkles, Plus, Eye, Coffee, Flame, Moon, Compass, Heart } from 'lucide-react';
import { MOOD_RECOMMENDATIONS } from '../data/restaurantData';
import { SIGNATURE_BOWLS } from '../data/menuData';
import { MoodType, MenuItem } from '../types';
import { useCart } from '../hooks/useCart';

interface MidnightRitualProps {
  onSelectItem: (item: MenuItem) => void;
}

export const MidnightRitual: React.FC<MidnightRitualProps> = ({ onSelectItem }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('dreamy');
  const { addToCart } = useCart();

  const currentRec = MOOD_RECOMMENDATIONS.find(m => m.mood === selectedMood) || MOOD_RECOMMENDATIONS[0];
  const matchedBowl = SIGNATURE_BOWLS.find(b => b.id === currentRec.bowlId) || SIGNATURE_BOWLS[0];

  const moodButtons: { id: MoodType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'dreamy', label: 'DREAMY', icon: <Moon className="w-3.5 h-3.5" />, color: '#B2A4FF' },
    { id: 'cozy', label: 'COZY', icon: <Coffee className="w-3.5 h-3.5" />, color: '#FFDAC1' },
    { id: 'quiet', label: 'QUIET', icon: <Heart className="w-3.5 h-3.5" />, color: '#DFD3C3' },
    { id: 'spicy', label: 'SPICY', icon: <Flame className="w-3.5 h-3.5" />, color: '#E98316' },
    { id: 'adventurous', label: 'ADVENTUROUS', icon: <Compass className="w-3.5 h-3.5" />, color: '#7CAFD1' }
  ];

  const handleAddRecToCart = () => {
    addToCart({
      menuItemId: matchedBowl.id,
      name: matchedBowl.name,
      price: matchedBowl.price,
      quantity: 1,
      image: matchedBowl.image,
      tag: matchedBowl.tag
    });
  };

  return (
    <section id="ritual" className="py-20 md:py-32 relative bg-[var(--bg-primary)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
            MIDNIGHT DISCOVERY
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
            Your Midnight Ritual
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-light">
            How does the night feel to you right now? Choose your mood, and let the kitchen suggest your sanctuary.
          </p>
        </div>

        {/* Mood Filter Pill Buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 mb-12">
          {moodButtons.map((btn) => {
            const isActive = selectedMood === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setSelectedMood(btn.id)}
                type="button"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-xs cursor-pointer ${
                  isActive
                    ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] scale-105 shadow-md font-bold'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <span>
                  {btn.icon}
                </span>
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Recommendation Card with Smooth Transition */}
        <div className="relative rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-lg p-6 sm:p-10 overflow-hidden transition-all duration-500">
          
          {/* Subtle Ambient Watermark Glow */}
          <div 
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
            style={{ 
              backgroundColor: moodButtons.find(m => m.id === selectedMood)?.color || 'var(--border-subtle)' 
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            
            {/* Left: Image of Recommended Bowl */}
            <div className="md:col-span-5">
              <div 
                onClick={() => onSelectItem(matchedBowl)}
                className="group cursor-pointer relative aspect-4/3 rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-md bg-[var(--bg-secondary)]"
              >
                <img
                  src={matchedBowl.image}
                  alt={matchedBowl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-semibold bg-[var(--bg-card)]/90 text-[var(--text-primary)] border border-[var(--border-subtle)]">
                  {matchedBowl.tag}
                </div>
              </div>
            </div>

            {/* Right: Recommendation Narrative & Action */}
            <div className="md:col-span-7 space-y-4 text-left">
              
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--text-muted)]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Recommended for your {selectedMood} state of mind</span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal">
                  {currentRec.title}
                </h3>
                <span className="font-serif text-2xl text-[var(--text-primary)] font-semibold">
                  ${matchedBowl.price}
                </span>
              </div>

              <p className="font-serif italic text-base sm:text-lg text-[var(--text-primary)] leading-snug">
                “{currentRec.quote}”
              </p>

              <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]/60 text-xs text-[var(--text-secondary)] space-y-1">
                <div><strong className="font-medium text-[var(--text-primary)]">Tasting Profile:</strong> {currentRec.notes}</div>
                <div><strong className="font-medium text-[var(--text-primary)]">Ambiance Match:</strong> {currentRec.ambientVibe}</div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleAddRecToCart}
                  type="button"
                  className="px-6 py-3 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:bg-[var(--btn-primary-hover)] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Order This Bowl · ${matchedBowl.price}</span>
                </button>

                <button
                  onClick={() => onSelectItem(matchedBowl)}
                  type="button"
                  className="px-5 py-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs uppercase tracking-widest font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>View Details</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
