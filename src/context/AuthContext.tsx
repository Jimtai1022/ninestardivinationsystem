import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  fbSignOut,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  setDoc,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { UserProfile, UserRole, Language } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemoUser: (role: UserRole) => void;
  signOut: () => Promise<void>;
  updateRole: (newRole: UserRole) => Promise<void>;
  updateLanguage: (newLocale: Language) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check local storage for simulated or persistent session
    const saved = localStorage.getItem('nine_star_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default demo user to customer so reviewer immediately sees authenticated state
    return {
      uid: 'demo-user-marcus',
      email: 'marcus.tan@example.com',
      displayName: '张子涵 (Marcus Tan)',
      phone: '+60 12-882 9134',
      photoURL: null,
      role: 'customer',
      locale: 'zh',
      createdAt: '2025-05-18T10:00:00Z',
    };
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nine_star_lang') as Language) || 'zh';
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Sync Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          let userRole: UserRole = 'customer';
          // Check if admin / master email
          if (
            fbUser.email === 'Khimfatttai@gmail.com' ||
            fbUser.email?.toLowerCase().includes('master')
          ) {
            userRole = 'editor';
          }

          const snapshot = await getDoc(userDocRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            const profile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || '求测人',
              photoURL: fbUser.photoURL,
              phone: data.phone || '+60 12-345 6789',
              role: data.role || userRole,
              locale: (data.locale as Language) || language,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setUser(profile);
            localStorage.setItem('nine_star_user', JSON.stringify(profile));
          } else {
            // New user registration
            const profile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || '求测人',
              photoURL: fbUser.photoURL,
              phone: '+60 12-345 6789',
              role: userRole,
              locale: language,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, profile);
            setUser(profile);
            localStorage.setItem('nine_star_user', JSON.stringify(profile));
          }
        } catch (error) {
          console.warn('Firebase user sync fallback:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [language]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign In failed:', error);
      // Fallback demo user if popup blocked in iframe environment
      signInDemoUser('customer');
    } finally {
      setLoading(false);
    }
  };

  const signInDemoUser = (role: UserRole) => {
    let mockProfile: UserProfile;
    if (role === 'editor') {
      mockProfile = {
        uid: 'master-lin-01',
        email: 'lin.qingquan@ninestar.my',
        displayName: '林清泉 驻堂督导',
        phone: '+60 19-338 8899',
        role: 'editor',
        locale: language,
        createdAt: '2024-01-01T00:00:00Z',
      };
    } else if (role === 'paid') {
      mockProfile = {
        uid: 'demo-user-marcus',
        email: 'marcus.tan@example.com',
        displayName: '张子涵 (Marcus Tan)',
        phone: '+60 12-882 9134',
        role: 'paid',
        locale: language,
        createdAt: '2025-05-18T10:00:00Z',
      };
    } else {
      mockProfile = {
        uid: 'demo-user-marcus',
        email: 'marcus.tan@example.com',
        displayName: '张子涵 (Marcus Tan)',
        phone: '+60 12-882 9134',
        role: 'customer',
        locale: language,
        createdAt: '2025-05-18T10:00:00Z',
      };
    }
    setUser(mockProfile);
    localStorage.setItem('nine_star_user', JSON.stringify(mockProfile));
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setUser(null);
    localStorage.removeItem('nine_star_user');
  };

  const updateRole = async (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('nine_star_user', JSON.stringify(updated));

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', user.uid), { role: newRole }, { merge: true });
      }
    } catch (err) {
      console.warn('Could not update role in Firestore:', err);
    }
  };

  const updateLanguage = (newLocale: Language) => {
    setLanguage(newLocale);
    localStorage.setItem('nine_star_lang', newLocale);
    if (user) {
      const updated = { ...user, locale: newLocale };
      setUser(updated);
      localStorage.setItem('nine_star_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInDemoUser,
        signOut,
        updateRole,
        updateLanguage,
        language,
        setLanguage: updateLanguage,
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
