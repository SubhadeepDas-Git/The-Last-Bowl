import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (data: { name: string; email: string; phone: string; password: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (partial: Partial<User>) => Promise<User>;
  isAuthModalOpen: boolean;
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  authModalTab: 'login' | 'signup';
  setAuthModalTab: (tab: 'login' | 'signup') => void;
  isProfileModalOpen: boolean;
  profileModalInitialTab: string;
  openProfileModal: (tab?: string) => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalInitialTab, setProfileModalInitialTab] = useState('orders');

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, []);

  const login = async (email: string, password: string) => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return user;
  };

  const signup = async (data: { name: string; email: string; phone: string; password: string }) => {
    const user = await authService.signup(data);
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return user;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsProfileModalOpen(false);
  };

  const updateProfile = async (partial: Partial<User>) => {
    if (!currentUser) throw new Error('No logged in user');
    const updated = await authService.updateProfile(currentUser.id, partial);
    setCurrentUser(updated);
    return updated;
  };

  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openProfileModal = (tab: string = 'orders') => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    setProfileModalInitialTab(tab);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        logout,
        updateProfile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalTab,
        setAuthModalTab,
        isProfileModalOpen,
        profileModalInitialTab,
        openProfileModal,
        closeProfileModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
