import React from 'react';
import { STORY_CONTENT, RESTAURANT_INFO } from '../data/restaurantData';

export const OurStory: React.FC = () => {
  return (
    <section id="our-story" className="py-20 md:py-32 relative overflow-hidden bg-[var(--bg-secondary)]/40 border-t border-[var(--border-subtle)]/60">
      
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
            {STORY_CONTENT.sectionLabel}
          </div>
          
          <h2 className="font-serif text-4xl sm:text-6xl text-[var(--text-primary)] font-normal tracking-tight">
            {STORY_CONTENT.heading}
          </h2>

          <div className="text-xs tracking-[0.2em] font-medium text-[var(--text-secondary)] uppercase">
            {STORY_CONTENT.subheading}
          </div>
        </div>

        {/* Story Grid: Editorial Vertical Image + Story Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Vertical Editorial Portrait Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Soft decorative backdrop layer */}
              <div className="absolute -inset-3 rounded-2xl sm:rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] transform -rotate-1 shadow-sm" />
              
              {/* Main Image Container */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xl bg-[var(--bg-card)] aspect-3/4">
                <img
                  src={RESTAURANT_INFO.images.storyPortrait}
                  alt="Late night bowl ramen kitchen atmosphere"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Corner detail */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[var(--bg-card)]/90 backdrop-blur-xs border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] font-serif italic text-center">
                  “A quiet hour when the world slows down.”
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {STORY_CONTENT.paragraphs.map((para, idx) => (
              <p 
                key={idx} 
                className={`text-[var(--text-secondary)] leading-relaxed font-light ${
                  idx === 0 
                    ? 'text-base sm:text-lg first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:text-[var(--text-primary)] first-letter:leading-none' 
                    : 'text-sm sm:text-base'
                }`}
              >
                {para}
              </p>
            ))}

            {/* Closing Line & Signature */}
            <div className="pt-6 border-t border-[var(--border-subtle)]/60 space-y-1">
              <p className="font-serif italic text-base text-[var(--text-secondary)]">
                {STORY_CONTENT.closing}
              </p>
              <p className="font-serif text-lg text-[var(--text-primary)] font-medium tracking-wide">
                {STORY_CONTENT.signature}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
