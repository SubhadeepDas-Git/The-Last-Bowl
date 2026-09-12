import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Menu as MenuIcon, X, Sparkles, Clock, 
  User as UserIcon, Package, Calendar, Truck, LogOut, ChevronDown, ShieldAlert 
} from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import { useRestaurantStatus } from '../hooks/useRestaurantStatus';
import { AmbientSoundToggle } from './AmbientSoundToggle';
import { ThemeSwitcher } from './ThemeSwitcher';

interface NavbarProps {
  onOpenReservationModal?: () => void;
  onOpenTrackOrderModal?: () => void;
  onOpenAdminModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenReservationModal,
  onOpenTrackOrderModal,
  onOpenAdminModal
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { totalItems, openCart } = useCart();
  const { currentUser, isAuthenticated, openAuthModal, openProfileModal, logout } = useAuth();
  const status = useRestaurantStatus();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'MENU', href: '#signature-bowls' },
    { name: 'OUR STORY', href: '#our-story' },
    { name: 'EXPERIENCE', href: '#benefits' },
    { name: 'BOOK A BOWL', href: '#reservation' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md shadow-sm border-b border-[var(--border-subtle)]/60 py-3' 
          : 'bg-[var(--bg-primary)]/60 backdrop-blur-xs py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <a 
          href="#hero" 
          onClick={(e) => handleLinkClick(e, '#hero')}
          className="group flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-serif text-sm shadow-xs group-hover:scale-105 transition-transform duration-300">
            <span className="relative top-[-1px]">終</span>
          </div>
          <div>
            <span className="font-serif tracking-widest text-lg sm:text-xl font-medium text-[var(--text-primary)] block leading-none">
              THE LAST BOWL
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] font-medium block mt-0.5">
              A Cozy Ramen Retreat After Dark
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-7" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-xs tracking-widest font-medium uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--text-primary)] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          
          {/* Theme Switcher Toggle */}
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>

          {/* Live Status Pill (Display-only for guests/customers, role-separated) */}
          <div
            title={`Status: ${status.statusHeadline}`}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-wider uppercase border border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs select-none"
          >
            <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="font-semibold">{status.badgeText}</span>
            <Clock className="w-3 h-3 text-[var(--text-muted)]" />
          </div>

          {/* Admin Fast Button if logged in as admin */}
          {currentUser?.role === 'admin' && onOpenAdminModal && (
            <button
              onClick={onOpenAdminModal}
              type="button"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-[#E98316] text-[11px] tracking-wider uppercase font-semibold transition-colors shadow-xs"
              title="Open Admin Management Console"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* Ambient Sound Toggle */}
          <div className="hidden md:block">
            <AmbientSoundToggle />
          </div>

          {/* Track Order Quick Action */}
          {onOpenTrackOrderModal && (
            <button
              onClick={onOpenTrackOrderModal}
              type="button"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[11px] tracking-wider uppercase text-[var(--text-primary)] transition-colors shadow-xs"
              title="Track Active Order"
            >
              <Truck className="w-3 h-3 text-[#E98316]" />
              <span className="font-medium">Track</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            type="button"
            className="relative p-2.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]"
            aria-label={`Open shopping cart with ${totalItems} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[var(--text-primary)]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E98316] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth Login or User Profile Trigger */}
          {isAuthenticated && currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(prev => !prev)}
                type="button"
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors shadow-xs"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="true"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-medium max-w-[80px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-[var(--border-subtle)]/60">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-[var(--text-primary)] block truncate">
                        {currentUser.name}
                      </span>
                      {currentUser.role === 'admin' && (
                        <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-[#E98316] border border-amber-500/30">
                          Admin
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] block truncate">
                      {currentUser.email}
                    </span>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'admin' && onOpenAdminModal && (
                      <button
                        onClick={() => { setProfileDropdownOpen(false); onOpenAdminModal(); }}
                        className="w-full px-4 py-2 text-left text-xs text-[#E98316] hover:bg-amber-500/10 flex items-center gap-2.5 font-semibold"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-[#E98316]" />
                        <span>Admin Console</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setProfileDropdownOpen(false); openProfileModal('orders'); }}
                      className="w-full px-4 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] flex items-center gap-2.5"
                    >
                      <Package className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => { setProfileDropdownOpen(false); openProfileModal('reservations'); }}
                      className="w-full px-4 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] flex items-center gap-2.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>My Reservations</span>
                    </button>
                    {onOpenTrackOrderModal && (
                      <button
                        onClick={() => { setProfileDropdownOpen(false); onOpenTrackOrderModal(); }}
                        className="w-full px-4 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] flex items-center gap-2.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>Track Order</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setProfileDropdownOpen(false); openProfileModal('preferences'); }}
                      className="w-full px-4 py-2 text-left text-xs text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] flex items-center gap-2.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Preferences & Theme</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[var(--border-subtle)]/60">
                    <button
                      onClick={() => { setProfileDropdownOpen(false); logout(); }}
                      className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-500/10 flex items-center gap-2.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs"
            >
              <UserIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Login</span>
            </button>
          )}

          {/* Primary CTA: Book Your Bowl */}
          <a
            href="#reservation"
            onClick={(e) => {
              if (onOpenReservationModal) {
                e.preventDefault();
                onOpenReservationModal();
              } else {
                handleLinkClick(e, '#reservation');
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 hover:shadow-md transition-all duration-300 active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-[#E98316]" />
            <span>Book A Bowl</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            type="button"
            className="xl:hidden p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-full bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] shadow-xl p-6 transition-all animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            
            {/* Status & Theme Switcher in Mobile Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]/60">
              <ThemeSwitcher />
              <AmbientSoundToggle />
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm tracking-widest font-medium uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-2 border-b border-[var(--border-subtle)]/30"
              >
                {link.name}
              </a>
            ))}

            {/* Mobile Auth and Tracking links */}
            <div className="pt-2 flex flex-col space-y-2">
              {onOpenTrackOrderModal && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenTrackOrderModal(); }}
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  <Truck className="w-3.5 h-3.5 text-[#E98316]" />
                  <span>Track Active Order</span>
                </button>
              )}

              {isAuthenticated && currentUser && currentUser.role === 'admin' && onOpenAdminModal && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdminModal(); }}
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/15 text-[#E98316] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#E98316]" />
                  <span>Admin Management Console</span>
                </button>
              )}

              {isAuthenticated && currentUser ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); openProfileModal('orders'); }}
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#E98316]" />
                  <span>View Profile & Orders ({currentUser.name})</span>
                </button>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  type="button"
                  className="w-full py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </button>
              )}

              <a
                href="#reservation"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (onOpenReservationModal) {
                    e.preventDefault();
                    onOpenReservationModal();
                  } else {
                    handleLinkClick(e, '#reservation');
                  }
                }}
                className="w-full py-3 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E98316]" />
                <span>Book A Bowl</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
