import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Moon } from 'lucide-react';

export const AmbientSoundToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft rain pink noise generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate soft distant rain
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;

      // Gentle warm lo-fi hum (55Hz drone / soft night resonance)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscNodeRef.current = osc;

    } catch (e) {
      console.warn('Web Audio could not be initialized', e);
    }
  };

  const toggleSound = () => {
    if (!audioCtxRef.current) {
      initAudio();
      setIsPlaying(true);
      return;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    } else if (isPlaying) {
      audioCtxRef.current.suspend();
      setIsPlaying(false);
    } else {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSound}
        type="button"
        title={isPlaying ? "Mute Midnight Ambience" : "Play Midnight Ambience (Rain & Warm Lo-Fi)"}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs tracking-wider uppercase border border-[#DFD3C3] bg-[#FDF9F3]/80 hover:bg-[#F1EAE0] transition-all duration-300 text-[#5C5047] hover:text-[#2D241F] shadow-sm"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#E98316] animate-pulse" />
            <span className="hidden sm:inline font-medium">Ambience: On</span>
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-0.5 h-2 bg-[#E98316] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-[#E98316] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-1.5 bg-[#E98316] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-[#8A7B70]" />
            <span className="hidden sm:inline">Night Ambience</span>
            <VolumeX className="w-3 h-3 text-[#8A7B70]" />
          </>
        )}
      </button>

      {isPlaying && (
        <input
          type="range"
          min="0"
          max="0.6"
          step="0.05"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-14 h-1 accent-[#2D241F] bg-[#DFD3C3] rounded-lg cursor-pointer"
          aria-label="Ambience volume"
        />
      )}
    </div>
  );
};
