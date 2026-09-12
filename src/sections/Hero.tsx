import React from 'react';
import { Sparkles, Compass, Moon } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeroProps {
  onOpenReservation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation }) => {
  const scrollToMenu = () => {
    const el = document.querySelector('#signature-bowls');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      
      {/* Marquee Ticker: "OPEN UNTIL DAWN" from original reference */}
      <div className="w-full overflow-hidden border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 py-2.5 mb-10 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center text-xs tracking-[0.25em] font-medium text-[var(--text-secondary)] uppercase">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="flex items-center mx-6">
              <span>OPEN UNTIL DAWN</span>
              <span className="mx-4 text-amber-500">✦</span>
              <span>A COZY RAMEN RETREAT</span>
              <span className="mx-4 text-purple-400">✦</span>
              <span>MIDNIGHT ALLEY</span>
              <span className="mx-4 text-[var(--border-subtle)]">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtitle & Moon badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Moon className="w-3.5 h-3.5 text-amber-500" />
          <span>Midnight Solace · Handcrafted Ramen</span>
        </div>

        {/* Large Elegant Heading */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[var(--text-primary)] font-normal mb-6 max-w-4xl mx-auto leading-[1.08] animate-in fade-in slide-in-from-bottom-3 duration-700">
          {RESTAURANT_INFO.name}
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-xl sm:text-2xl lg:text-3xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700">
          “{RESTAURANT_INFO.tagline}”
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <button
            onClick={onOpenReservation}
            type="button"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:bg-[var(--btn-primary-hover)] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Book Your Bowl</span>
          </button>

          <button
            onClick={scrollToMenu}
            type="button"
            className="w-full sm:w-auto px-8 py-4 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)] text-xs uppercase tracking-widest font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Explore the Menu</span>
          </button>
        </div>

        {/* Cinematic Atmospheric Hero Banner with Steam Effect */}
        <div className="relative mx-auto max-w-5xl rounded-2xl md:rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-xl bg-[var(--bg-card)] group">
          
          {/* Authentic Wix Banner Asset */}
          <div className="relative aspect-16/9 sm:aspect-21/9 overflow-hidden">
            <img
              src={RESTAURANT_INFO.images.heroBanner}
              alt="The Last Bowl late night ramen sanctuary"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-1000 ease-out"
              loading="eager"
            />
            {/* Atmospheric subtle vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Rising Steam SVG overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-70 flex gap-6">
              <div className="w-8 h-20 bg-gradient-to-t from-white/30 to-transparent rounded-full filter blur-md animate-steam-1" />
              <div className="w-10 h-24 bg-gradient-to-t from-amber-200/40 to-transparent rounded-full filter blur-md animate-steam-2" />
              <div className="w-8 h-20 bg-gradient-to-t from-white/30 to-transparent rounded-full filter blur-md animate-steam-3" />
            </div>

            {/* Floating corner tag */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)]/90 backdrop-blur-xs border border-[var(--border-subtle)] text-[10px] tracking-widest uppercase font-medium text-[var(--text-primary)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Midnight Alley Sanctuary · Counter Seating</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
