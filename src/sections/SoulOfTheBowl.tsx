import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const SoulOfTheBowl: React.FC = () => {
  const scrollToStory = () => {
    const el = document.querySelector('#our-story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="soul" className="py-20 md:py-32 relative overflow-hidden bg-[var(--bg-secondary)]/50 border-y border-[var(--border-subtle)]/60">
      
      {/* Delicate background decorative circle */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Atmospheric Image with Round Editorial Framing */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="relative group">
              
              {/* Outer decorative ring */}
              <div className="absolute -inset-3 rounded-full border border-dashed border-[var(--border-subtle)] animate-spin-slow opacity-60" style={{ animationDuration: '60s' }} />
              
              {/* Glow backdrop */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-400/20 via-purple-400/15 to-transparent blur-md" />

              {/* Main Circular Ramen Bowl Artwork */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-2 border-[var(--border-subtle)] shadow-xl bg-[var(--bg-card)]">
                <img
                  src={RESTAURANT_INFO.images.soulOfBowl}
                  alt="The Soul of the Bowl craftsmanship"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Floating Japanese Badge */}
              <div className="absolute -bottom-2 right-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] px-4 py-2 rounded-full shadow-md text-xs font-serif text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>一杯の魂 · Soul in Every Sip</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Philosophy & Story snippet */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 text-left">
            
            <div className="inline-block text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-1">
              PHILOSOPHY & SANCTUARY
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal leading-[1.18]">
              The Soul of the Bowl
            </h2>

            <blockquote className="font-serif italic text-lg sm:text-xl text-[var(--text-primary)] border-l-2 border-amber-500 pl-4 py-1 leading-relaxed">
              “{RESTAURANT_INFO.philosophy}”
            </blockquote>

            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-light">
              At The Last Bowl, we've crafted a sanctuary for those who find their rhythm in the neon glow of the Midnight Alley. Our ramen is a nostalgic blend of tradition and modernity, served with a whimsical touch that makes every midnight meal feel like a cozy retreat.
            </p>

            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-light">
              We simmer every broth unhurriedly through the twilight hours, allowing rich miso, clean kombu, and roasted bones to reach their deepest harmony just as the city turns quiet.
            </p>

            <div className="pt-2">
              <button
                onClick={scrollToStory}
                type="button"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[var(--text-primary)] hover:text-amber-500 transition-colors group cursor-pointer"
              >
                <span>Discover Our Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
