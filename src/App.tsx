import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './hooks/useCart';
import { NightSkyBackground } from './components/NightSkyBackground';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { MenuItemModal } from './components/MenuItemModal';
import { ReservationModal } from './components/ReservationModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { DeliveryTrackerModal } from './components/DeliveryTrackerModal';
import { AdminModal } from './components/AdminModal';

import { Hero } from './sections/Hero';
import { SoulOfTheBowl } from './sections/SoulOfTheBowl';
import { Benefits } from './sections/Benefits';
import { SignatureBowls } from './sections/SignatureBowls';
import { OurStory } from './sections/OurStory';
import { CozyAmbiance } from './sections/CozyAmbiance';
import { MidnightRitual } from './sections/MidnightRitual';
import { ExploreMenu } from './sections/ExploreMenu';
import { BuildYourBowl } from './sections/BuildYourBowl';
import { ReservationSection } from './sections/ReservationSection';
import { VisitUs } from './sections/VisitUs';
import { Footer } from './sections/Footer';

import { MenuItem } from './types';

const AppContent: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [trackerOrderId, setTrackerOrderId] = useState<string | null>(null);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const { isProfileModalOpen, closeProfileModal, profileModalInitialTab } = useAuth();

  const handleOpenTracker = (orderId?: string) => {
    if (orderId) {
      setTrackerOrderId(orderId);
    }
    setTrackerModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[#FFDAC1] selection:text-[#2D241F] transition-colors duration-500">
      
      {/* Soft atmospheric background glow & subtle stars */}
      <NightSkyBackground />

      {/* Sticky Header Navigation */}
      <Navbar 
        onOpenReservationModal={() => setReservationModalOpen(true)} 
        onOpenTrackOrderModal={() => handleOpenTracker()}
        onOpenAdminModal={() => setAdminModalOpen(true)}
      />

      {/* Main Content Flow */}
      <main id="main-content" className="relative z-10">
        
        {/* 1. Hero Section */}
        <Hero 
          onOpenReservation={() => setReservationModalOpen(true)} 
        />

        {/* 2. The Soul of the Bowl */}
        <SoulOfTheBowl />

        {/* 3. Benefits / Experience */}
        <Benefits 
          onOpenReservation={() => setReservationModalOpen(true)} 
        />

        {/* 4. Signature Bowls (Editorial Ramen Menu) */}
        <SignatureBowls 
          onSelectItem={(item) => setSelectedMenuItem(item)} 
        />

        {/* 5. Our Story */}
        <OurStory />

        {/* 6. Cozy Ambiance / Restaurant Experience */}
        <CozyAmbiance />

        {/* 7. Midnight Ritual (Interactive Mood Selector) */}
        <MidnightRitual 
          onSelectItem={(item) => setSelectedMenuItem(item)} 
        />

        {/* 8. Explore Full Menu (Filterable by category) */}
        <ExploreMenu 
          onSelectItem={(item) => setSelectedMenuItem(item)} 
        />

        {/* 9. Build Your Bowl (Interactive Customizer) */}
        <BuildYourBowl />

        {/* 10. Book Your Bowl (Reservation Section) */}
        <ReservationSection />

        {/* 11. Visit Us & Live Late-Night Status */}
        <VisitUs />

      </main>

      {/* 12. Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <CartDrawer 
        onTrackOrder={(orderId) => handleOpenTracker(orderId)}
      />

      <MenuItemModal
        key={selectedMenuItem?.id || 'modal-none'}
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
      />

      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
      />

      <AuthModal />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        initialTab={profileModalInitialTab}
        onTrackOrder={(orderId) => {
          closeProfileModal();
          handleOpenTracker(orderId);
        }}
      />

      <DeliveryTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        initialOrderId={trackerOrderId}
      />

      <AdminModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
