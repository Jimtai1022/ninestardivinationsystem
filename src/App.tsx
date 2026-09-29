/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConsultationProvider, useConsultation } from './context/ConsultationContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ReadingView } from './components/ReadingView';
import { MasterConsole } from './components/MasterConsole';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { RoleSwitcher } from './components/RoleSwitcher';

function MainApp() {
  const { user } = useAuth();
  const { setActiveConsultationId } = useConsultation();
  const [currentView, setCurrentView] = useState<'landing' | 'reading' | 'master'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleNavigateToReading = (consultationId?: string) => {
    if (consultationId) {
      setActiveConsultationId(consultationId);
    }
    setCurrentView('reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4faff] text-[#0d1e25]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full pt-20">
        {currentView === 'landing' && (
          <LandingPage
            onNavigateToReading={handleNavigateToReading}
            onOpenAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {currentView === 'reading' && (
          <ReadingView onBack={() => setCurrentView('landing')} />
        )}

        {currentView === 'master' && <MasterConsole />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Authentication / Sign-up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          // If master, go to master; otherwise go to reading or landing
          if (user?.role === 'editor') {
            setCurrentView('master');
          }
        }}
      />

      {/* Floating Role Switcher for Testing All 3 User Journeys & Edge Cases */}
      <RoleSwitcher currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConsultationProvider>
        <MainApp />
      </ConsultationProvider>
    </AuthProvider>
  );
}
