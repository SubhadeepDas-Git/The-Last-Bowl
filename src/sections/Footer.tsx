import React from 'react';
import { Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const Footer: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] pt-16 pb-12 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[var(--border-subtle)]/70 text-left">
          
          {/* Brand Column (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-serif text-sm font-bold shadow-xs">
                終
              </div>
              <span className="font-serif text-2xl tracking-widest text-[var(--text-primary)] font-medium">
                {RESTAURANT_INFO.name}
              </span>
            </div>

            <p className="font-serif italic text-base text-[var(--text-primary)] font-light">
              “A little warmth after dark.”
            </p>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm font-light">
              Crafted for anyone who finds their quiet rhythm when the rest of the city has gone to sleep. Hand-rolled noodles, 12-hour broths, and peace at midnight.
            </p>

            <div className="pt-2 text-xs text-[var(--text-secondary)] space-y-1">
              <div>{RESTAURANT_INFO.location.address}</div>
              <div className="text-amber-500">{RESTAURANT_INFO.contact.email}</div>
            </div>
          </div>

          {/* Navigation Links (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-primary)]">
              Sanctuary
            </h4>
            <ul className="space-y-2 text-xs text-[var(--text-muted)]">
              <li>
                <a 
                  href="#hero" 
                  onClick={(e) => handleScrollTo(e, '#hero')}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Home Retreat
                </a>
              </li>
              <li>
                <a 
                  href="#soul" 
                  onClick={(e) => handleScrollTo(e, '#soul')}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  The Soul of the Bowl
                </a>
              </li>
              <li>
                <a 
                  href="#signature-bowls" 
                  onClick={(e) => handleScrollTo(e, '#signature-bowls')}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Signature Bowls
                </a>
              </li>
              <li>
                <a 
                  href="#our-story" 
                  onClick={(e) => handleScrollTo(e, '#our-story')}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a 
                  href="#ritual" 
                  onClick={(e) => handleScrollTo(e, '#ritual')}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Midnight Ritual
                </a>
              </li>
              <li>
                <a 
                  href="#build-bowl" 
                  onClick={(e) => handleScrollTo(e, '#build-bowl')}
                  className="hover:text-[var(--text-primary)] transition-colors"
                >
                  Build Your Bowl
                </a>
              </li>
            </ul>
          </div>

          {/* Operating Hours & Notes (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--text-primary)]">
              Midnight Hours
            </h4>
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between font-medium text-[var(--text-primary)]">
                <span>Monday – Sunday</span>
                <span className="text-amber-500 font-semibold">7:00 PM – 4:00 AM</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] pt-1">
                Last food order accepted at 3:30 AM. Broth refills and hot tea served until closing.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#reservation"
                onClick={(e) => handleScrollTo(e, '#reservation')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-amber-500 hover:underline transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Reserve a Quiet Table →</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <div>
            {RESTAURANT_INFO.copyright}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px]">With warmth, always</span>
            <span>·</span>
            <span className="text-[11px]">Late Night Bowl Studio</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
