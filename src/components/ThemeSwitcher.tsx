import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Sparkles, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../types';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'compact' | 'pill';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className = '',
  variant = 'compact'
}) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'pastel', label: 'Pastel', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> }
  ];

  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (variant === 'pill') {
    return (
      <div 
        className={`inline-flex items-center p-0.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-xs ${className}`}
        role="radiogroup"
        aria-label="Select website theme"
      >
        {themes.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              role="radio"
              aria-checked={isActive}
              title={`${t.label} Theme`}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t.icon}
              <span className="text-[11px] uppercase tracking-wider">{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Compact Trigger Button: THEME ▾ */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Current theme: ${currentThemeObj.label}. Click to switch theme.`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] transition-all duration-300 shadow-xs cursor-pointer select-none"
      >
        {currentThemeObj.icon}
        <span className="text-[11px] font-semibold tracking-widest uppercase">
          THEME
        </span>
        <ChevronDown 
          className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Vertical Popover Dropdown */}
      {isOpen && (
        <div 
          role="menu"
          aria-label="Theme options"
          className="absolute right-0 mt-2 w-36 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
        >
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/60 hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {t.icon}
                  <span className="tracking-wider uppercase text-[11px]">{t.label}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-[var(--text-primary)] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
