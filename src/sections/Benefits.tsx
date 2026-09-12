import React from 'react';
import { UtensilsCrossed, LampDesk, MoonStar, Sparkles } from 'lucide-react';
import { BENEFITS } from '../data/restaurantData';

interface BenefitsProps {
  onOpenReservation: () => void;
}

export const Benefits: React.FC<BenefitsProps> = ({ onOpenReservation }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'signature-bowls':
        return <UtensilsCrossed className="w-6 h-6 text-[var(--text-primary)]" />;
      case 'cozy-ambiance':
        return <LampDesk className="w-6 h-6 text-[var(--text-primary)]" />;
      case 'midnight-ritual':
      default:
        return <MoonStar className="w-6 h-6 text-[var(--text-primary)]" />;
    }
  };

  return (
    <section id="benefits" className="py-20 md:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-block text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-1">
            WHY WE GATHER AT MIDNIGHT
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
            The Last Bowl Benefits
          </h2>

          <p className="text-[var(--text-secondary)] text-sm sm:text-base font-light leading-relaxed">
            We've curated a cozy retreat for those who crave comfort after midnight. Discover why our ramen is more than just food—it's a ritual.
          </p>
        </div>

        {/* 3 Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14 text-left">
          {BENEFITS.map((benefit, idx) => (
            <div
              key={benefit.id}
              className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-subtle)]/80 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group flex flex-col justify-between"
            >
              <div>
                {/* Icon Container with Soft Glow */}
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]/60 flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all duration-300 shadow-xs">
                  {getIcon(benefit.id)}
                </div>

                {/* Subtitle tag */}
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[var(--text-muted)] block mb-2">
                  0{idx + 1} · {benefit.subtitle}
                </span>

                {/* Heading */}
                <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-medium mb-3 transition-colors">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>

              {/* Bottom accent badge */}
              <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]/40 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>{benefit.badge}</span>
                <span className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA: Book Your Bowl */}
        <div className="inline-block">
          <button
            onClick={onOpenReservation}
            type="button"
            className="px-8 py-4 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:bg-[var(--btn-primary-hover)] hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto active:scale-98 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Book Your Bowl</span>
          </button>
        </div>

      </div>
    </section>
  );
};
