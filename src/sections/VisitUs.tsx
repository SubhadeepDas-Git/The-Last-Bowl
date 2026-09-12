import React from 'react';
import { MapPin, Clock, Mail, Navigation } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { useRestaurantStatus } from '../hooks/useRestaurantStatus';

export const VisitUs: React.FC = () => {
  const status = useRestaurantStatus();

  return (
    <section id="visit" className="py-20 md:py-32 relative bg-[var(--bg-secondary)]/50 border-t border-[var(--border-subtle)]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header from Reference */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
            MIDNIGHT SANCTUARY
          </div>
          
          <h2 className="font-serif text-4xl sm:text-6xl text-[var(--text-primary)] font-normal tracking-tight">
            Ready to Warm Your Soul?
          </h2>

          <p className="font-serif italic text-xl sm:text-2xl text-[var(--text-secondary)] font-light">
            “Visit us tonight”
          </p>
        </div>

        {/* Info & Map Display Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left: Location & Hours details */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md flex flex-col justify-between space-y-8 text-left">
            
            <div className="space-y-6">
              
              {/* Central Official Live Status Indicator */}
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-600'}`} />
                    <span className="text-xs uppercase tracking-widest font-bold text-[var(--text-primary)]">
                      {status.badgeText}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                    Official Hours
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {status.subtext}
                </p>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)]/60 text-[var(--text-primary)]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[var(--text-primary)] font-medium">
                    {RESTAURANT_INFO.location.address}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {RESTAURANT_INFO.location.subtext}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-light">
                    {RESTAURANT_INFO.location.transitTip}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)]/60 text-[var(--text-primary)]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[var(--text-primary)] font-medium">
                    Operating Hours
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {RESTAURANT_INFO.hours.display}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-light">
                    {RESTAURANT_INFO.hours.note}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)]/60 text-[var(--text-primary)]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[var(--text-primary)] font-medium">
                    Inquiries & Private Seating
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
                    {RESTAURANT_INFO.contact.email}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-mono">
                    {RESTAURANT_INFO.contact.phone}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick directions helper */}
            <div className="pt-4 border-t border-[var(--border-subtle)]/60 flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Free street parking after 8 PM</span>
              <a
                href="#hero"
                className="text-[var(--text-primary)] font-medium hover:text-amber-600 flex items-center gap-1"
              >
                Back to Top ↑
              </a>
            </div>

          </div>

          {/* Right: Stylized Atmospheric Midnight Map Illustration */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-md bg-[var(--bg-card)] relative min-h-[380px] flex items-center justify-center p-8 text-center">
            
            {/* Dark Midnight Grid Texture */}
            <div 
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(var(--border-subtle) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Neon District Road Geometry Overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 600 400" preserveAspectRatio="none">
              <path d="M 0 100 Q 200 120 300 200 T 600 220" stroke="var(--accent-peach)" strokeWidth="2" fill="none" strokeDasharray="6 6" />
              <path d="M 150 0 L 150 400" stroke="var(--border-subtle)" strokeWidth="1" fill="none" />
              <path d="M 300 0 L 300 400" stroke="var(--accent-lavender)" strokeWidth="1.5" fill="none" />
              <path d="M 450 0 L 450 400" stroke="var(--border-subtle)" strokeWidth="1" fill="none" />
              <path d="M 0 300 L 600 300" stroke="var(--border-subtle)" strokeWidth="1" fill="none" />
            </svg>

            {/* Glowing Sanctuary Marker */}
            <div className="relative z-10 space-y-4 max-w-sm">
              <div className="relative inline-block">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center mx-auto animate-ping" />
                <div className="absolute inset-0 w-14 h-14 rounded-full bg-[var(--btn-primary-bg)] border-2 border-[var(--accent-peach)] flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-[var(--accent-peach)]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                  You are warmly invited
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal">
                  Midnight Alley Sanctuary
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Look for the soft copper lantern hanging above the wooden sliding door. Push gently; we are waiting inside.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-semibold hover:bg-[var(--btn-primary-hover)] transition-all shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Navigation</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
