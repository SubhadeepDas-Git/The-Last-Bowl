import React, { useState, useEffect } from 'react';
import { X, Sparkles, Lock, Mail, Phone, User as UserIcon, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, setAuthModalTab, login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsForgotPassword(false);
  }, [authModalTab, isAuthModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({ name, email, phone, password });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your account email to receive recovery instructions.');
      return;
    }
    setIsSubmitting(true);
    try {
      const message = await authService.forgotPassword(email);
      setSuccessMsg(message);
      setErrorMsg(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('wanderer@thelastbowl.com');
    setPassword('ramen123');
    setErrorMsg(null);
  };

  const fillDemoAdmin = () => {
    setEmail('admin@thelastbowl.com');
    setPassword('admin123');
    setErrorMsg(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-md bg-[var(--bg-card)] rounded-3xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="p-6 sm:p-8 pb-4 text-center border-b border-[var(--border-subtle)]/60 bg-[var(--bg-secondary)]/50">
          <div className="w-10 h-10 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] mx-auto flex items-center justify-center font-serif text-sm font-bold mb-3 shadow-xs">
            終
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-medium">
            {isForgotPassword 
              ? 'Recover Whisper' 
              : authModalTab === 'login' 
                ? 'Welcome to The Last Bowl' 
                : 'Join The Midnight Retreat'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-light">
            {isForgotPassword 
              ? 'Enter your email to receive recovery instructions.' 
              : authModalTab === 'login' 
                ? 'Sign in to access your bowls, reservations, and order journeys.' 
                : 'Create an account to reserve tables and track late-night cravings.'}
          </p>

          {/* Quick Demo Fill Buttons */}
          {!isForgotPassword && authModalTab === 'login' && (
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={fillDemoCustomer}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--border-subtle)]/40 text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Customer Demo
              </button>
              <button
                onClick={fillDemoAdmin}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/15 text-amber-600 border border-amber-500/30 hover:bg-amber-500/25 transition-colors cursor-pointer"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Admin Demo
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher if not in forgot password mode */}
        {!isForgotPassword && (
          <div className="flex border-b border-[var(--border-subtle)]/60 bg-[var(--bg-card)]">
            <button
              type="button"
              onClick={() => { setAuthModalTab('login'); setErrorMsg(null); }}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
                authModalTab === 'login'
                  ? 'border-b-2 border-[#E98316] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalTab('signup'); setErrorMsg(null); }}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
                authModalTab === 'signup'
                  ? 'border-b-2 border-[#E98316] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-300/40 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-300/40 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {isForgotPassword ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="wanderer@thelastbowl.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending Whisper...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : authModalTab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="wanderer@thelastbowl.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[11px] text-[var(--text-muted)] hover:text-[#E98316] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E98316]" />
                  <span>{isSubmitting ? 'Entering Retreat...' : 'Sign In'}</span>
                </button>
              </div>

              <div className="text-center pt-1 text-xs text-[var(--text-secondary)]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalTab('signup')}
                  className="font-semibold text-[#E98316] hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ren Takahashi"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@nightretreat.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-medium block mb-1">
                    Confirm *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#E98316]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs uppercase tracking-widest font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-[#E98316]" />
                  <span>{isSubmitting ? 'Creating Sanctuary...' : 'Create Account'}</span>
                </button>
              </div>

              <div className="text-center pt-1 text-xs text-[var(--text-secondary)]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalTab('login')}
                  className="font-semibold text-[#E98316] hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* Guest Dismiss Option */}
          <div className="pt-3 border-t border-[var(--border-subtle)]/60 text-center">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer font-medium"
            >
              Continue as Guest (Browse Only) →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
