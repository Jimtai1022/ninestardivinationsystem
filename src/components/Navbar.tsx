import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'reading' | 'master';
  setCurrentView: (view: 'landing' | 'reading' | 'master') => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuthModal,
}) => {
  const { user, signOut, language, setLanguage } = useAuth();
  const t = getTranslation(language);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f4faff]/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#bec8cb]/20">
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand logo & title */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#006673] to-[#1d808f] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[24px]">stars</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[20px] text-[#0d1e25] tracking-tight leading-none">
              {t.brandName}
            </span>
            <span className="text-[12px] text-[#3e484b] tracking-wider uppercase mt-1 leading-none font-medium">
              {t.brandSub}
            </span>
          </div>
        </button>

        {/* Navigation links */}
        <nav className="hidden xl:flex items-center gap-1">
          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
              currentView === 'landing'
                ? 'bg-[#dff1fb] text-[#006673]'
                : 'text-[#3e484b] hover:text-[#0d1e25] hover:bg-[#d9ebf5]'
            }`}
          >
            {t.navServices}
          </button>
          <button
            onClick={() => setCurrentView('reading')}
            className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
              currentView === 'reading'
                ? 'bg-[#dff1fb] text-[#006673]'
                : 'text-[#3e484b] hover:text-[#0d1e25] hover:bg-[#d9ebf5]'
            }`}
          >
            {t.navCards}
          </button>
          <button
            onClick={() => setCurrentView('reading')}
            className="px-3 py-2 rounded-lg text-[14px] font-medium text-[#3e484b] hover:text-[#0d1e25] hover:bg-[#d9ebf5] transition-colors"
          >
            {t.navEightPalaces}
          </button>
          <button
            onClick={() => {
              setCurrentView('landing');
              setTimeout(() => {
                document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-3 py-2 rounded-lg text-[14px] font-medium text-[#3e484b] hover:text-[#0d1e25] hover:bg-[#d9ebf5] transition-colors"
          >
            {t.navPlans}
          </button>
          {user?.role === 'editor' && (
            <button
              onClick={() => setCurrentView('master')}
              className={`px-3 py-2 rounded-lg text-[14px] font-semibold transition-colors flex items-center gap-1.5 ${
                currentView === 'master'
                  ? 'bg-[#006673] text-white shadow-sm'
                  : 'text-[#006673] bg-[#006673]/10 hover:bg-[#006673]/20'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span>{t.masterConsole}</span>
            </button>
          )}
        </nav>

        {/* Right side controls: Language toggle, User role/profile, Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Bilingual Switcher */}
          <div className="flex items-center bg-[#dff1fb] p-1 rounded-full text-[12px]">
            <button
              onClick={() => setLanguage('zh')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                language === 'zh'
                  ? 'bg-white text-[#006673] shadow-sm font-semibold'
                  : 'text-[#3e484b] hover:text-[#0d1e25]'
              }`}
              type="button"
            >
              中文
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                language === 'en'
                  ? 'bg-white text-[#006673] shadow-sm font-semibold'
                  : 'text-[#3e484b] hover:text-[#0d1e25]'
              }`}
              type="button"
            >
              EN
            </button>
          </div>

          {/* User Status / Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('reading')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] bg-white text-[#0d1e25] shadow-sm hover:bg-[#d9ebf5] transition-colors border border-[#bec8cb]/30"
              >
                <span className="material-symbols-outlined text-[16px] text-[#006673]">description</span>
                <span className="truncate max-w-[120px] font-medium">{user.displayName || '求测人'}</span>
                {user.role === 'paid' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c3e8ff] text-[#006673] font-bold">
                    VIP
                  </span>
                )}
                {user.role === 'editor' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#006673] text-white font-bold">
                    大师
                  </span>
                )}
              </button>
              <button
                onClick={signOut}
                title={t.logout}
                className="p-2 rounded-lg text-[#3e484b] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-[14px] font-medium text-[#0d1e25] bg-white shadow-sm hover:bg-[#d9ebf5] transition-all border border-[#bec8cb]/30"
            >
              {t.login}
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={() => {
              if (!user) {
                onOpenAuthModal();
              } else {
                setCurrentView('landing');
                setTimeout(() => {
                  document.getElementById('consultation-form-card')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-[14px] font-medium text-white bg-[#006673] hover:bg-[#1d808f] transition-all shadow-[0_2px_8px_rgba(0,102,115,0.25)]"
          >
            {t.consultNow}
          </button>
        </div>
      </div>
    </header>
  );
};
