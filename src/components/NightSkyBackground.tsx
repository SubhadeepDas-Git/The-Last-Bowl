import React from 'react';

export const NightSkyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Soft atmospheric gradient glows */}
      <div 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-3xl opacity-25 animate-float-slow"
        style={{ background: 'radial-gradient(circle, #FFDAC1 0%, rgba(255,218,193,0) 70%)' }}
      />
      <div 
        className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full blur-3xl opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle, #B2A4FF 0%, rgba(178,164,255,0) 70%)' }}
      />
      <div 
        className="absolute bottom-20 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #FFB7B2 0%, rgba(255,183,178,0) 70%)' }}
      />

      {/* Understated subtle celestial stars */}
      <div className="absolute top-24 left-[15%] w-1.5 h-1.5 rounded-full bg-[#DFD3C3] opacity-60 animate-glow" />
      <div className="absolute top-40 right-[22%] w-2 h-2 rounded-full bg-[#FFDAC1] opacity-70 animate-glow" style={{ animationDelay: '1.2s' }} />
      <div className="absolute top-72 left-[48%] w-1 h-1 rounded-full bg-[#DFD3C3] opacity-50 animate-glow" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-[600px] right-[10%] w-1.5 h-1.5 rounded-full bg-[#B2A4FF] opacity-60 animate-glow" style={{ animationDelay: '0.7s' }} />
      <div className="absolute top-[850px] left-[8%] w-1 h-1 rounded-full bg-[#DFD3C3] opacity-40 animate-glow" style={{ animationDelay: '3.1s' }} />
      <div className="absolute top-[1200px] right-[18%] w-2 h-2 rounded-full bg-[#FFDAC1] opacity-50 animate-glow" style={{ animationDelay: '1.8s' }} />
      <div className="absolute top-[1600px] left-[30%] w-1 h-1 rounded-full bg-[#B2A4FF] opacity-60 animate-glow" style={{ animationDelay: '2.2s' }} />
      <div className="absolute top-[2100px] right-[28%] w-1.5 h-1.5 rounded-full bg-[#DFD3C3] opacity-50 animate-glow" style={{ animationDelay: '0.4s' }} />
      <div className="absolute top-[2600px] left-[18%] w-1.5 h-1.5 rounded-full bg-[#FFDAC1] opacity-60 animate-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-[3100px] right-[12%] w-1 h-1 rounded-full bg-[#B2A4FF] opacity-50 animate-glow" style={{ animationDelay: '2.8s' }} />

      {/* Subtle paper grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};
