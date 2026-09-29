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
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';

function MainApp() {
  const { user } = useAuth();
  const { setActiveConsultationId } = useConsultation();
  const [currentView, setCurrentView] = useState<'landing' | 'reading' | 'master' | 'admin'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);

  const handleNavigateToReading = (consultationId?: string) => {
    if (consultationId) {
      setActiveConsultationId(consultationId);
    }
    setCurrentView('reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4faff] text-[#0d1e25]">
      {/* Top Navbar (Customer navigation only - No admin sign up or login) */}
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

        {currentView === 'admin' && (
          <AdminPanel onBack={() => setCurrentView('landing')} />
        )}
      </main>

      {/* Footer with Admin Sign Up / Login Link */}
      <Footer
        onOpenAdminAuth={() => setAdminAuthModalOpen(true)}
        onNavigateToAdmin={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Standard Customer Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (user?.role === 'admin') {
            setCurrentView('admin');
          } else if (user?.role === 'editor') {
            setCurrentView('master');
          }
        }}
      />

      {/* Admin Specific Authentication Modal with Single Slot RBAC */}
      <AdminAuthModal
        isOpen={adminAuthModalOpen}
        onClose={() => setAdminAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
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
