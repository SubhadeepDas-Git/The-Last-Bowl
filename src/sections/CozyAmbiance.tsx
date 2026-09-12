import React from 'react';
import { Sparkles, Moon, Lamp, Clock, Music } from 'lucide-react';

export const CozyAmbiance: React.FC = () => {
  const moments = [
    {
      title: 'Counter Bar Whispers',
      subtitle: '1:00 AM · Counter Seating',
      description: 'Steam curls past the cedarwood counter as late-night cooks season hot broths with quiet precision.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Rain Against the Eaves',
      subtitle: '2:15 AM · Window Nook',
      description: 'Watch the neon reflections ripple along Midnight Alley while sipping hot dashi from handmade ceramic cups.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Warm Copper Lanterns',
      subtitle: '3:00 AM · Solitary Slurps',
      description: 'The world outside has completely quieted. Only low jazz, the clink of porcelain spoons, and comforting warmth.',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800&auto=format&fit=crop'
    }
  ];

  return (
    <section id="ambiance" className="py-20 md:py-32 relative bg-[var(--bg-secondary)]/40 border-y border-[var(--border-subtle)]/60 overflow-hidden">
      
      {/* Delicate celestial glowing accents */}
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-[var(--text-muted)]">
            <Moon className="w-3.5 h-3.5 text-amber-500" />
            <span>VIRTUAL SANCTUARY VISIT</span>
          </div>
          
          <h2 className="font-serif text-4xl sm:text-6xl text-[var(--text-primary)] font-normal tracking-tight">
            Cozy Ambiance
          </h2>

          <p className="font-serif italic text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto font-light">
            “Imagine walking into a tiny ramen shop at 1:00 AM. The city outside is quiet. There is warm light. Steam rises from your bowl. There is soft music. You finally slow down.”
          </p>
        </div>

        {/* 3 Atmospheric Photo Vignettes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {moments.map((m) => (
            <div
              key={m.title}
              className="group rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[var(--bg-secondary)]">
                <img
                  src={m.image}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full bg-[var(--bg-card)]/90 text-[var(--text-primary)] border border-[var(--border-subtle)]">
                  {m.subtitle}
                </span>
              </div>

              <div className="p-6 space-y-2 text-left">
                <h3 className="font-serif text-xl text-[var(--text-primary)] font-medium group-hover:text-amber-500 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-light">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Ambient Sensations Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]/60 space-y-1">
            <Lamp className="w-4 h-4 mx-auto text-amber-500" />
            <div className="font-serif text-sm text-[var(--text-primary)]">2200K Warm Light</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Soft Amber Hue</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]/60 space-y-1">
            <Music className="w-4 h-4 mx-auto text-purple-400" />
            <div className="font-serif text-sm text-[var(--text-primary)]">Midnight Lo-Fi</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Gentle Rain Resonance</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]/60 space-y-1">
            <Clock className="w-4 h-4 mx-auto text-[var(--text-secondary)]" />
            <div className="font-serif text-sm text-[var(--text-primary)]">Open Until Dawn</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">7:00 PM – 4:00 AM</div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]/60 space-y-1">
            <Sparkles className="w-4 h-4 mx-auto text-amber-300" />
            <div className="font-serif text-sm text-[var(--text-primary)]">Slow Simmer</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Unhurried Dining</div>
          </div>
        </div>

      </div>
    </section>
  );
};
