import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
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
  signInWithGoogle: (roleOverride?: UserRole) => Promise<void>;
  registerUser: (params: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
  }) => Promise<void>;
  loginUser: (email: string, pass: string) => Promise<void>;
  signInDemoUser: (role: UserRole) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  signOut: () => Promise<void>;
  updateRole: (newRole: UserRole) => Promise<void>;
  updateLanguage: (newLocale: Language) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check local storage for persistent session
    const saved = localStorage.getItem('nine_star_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Strict requirement: User must register or log in to obtain role
    return null;
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
            fbUser.email?.toLowerCase() === 'khimfatttai@gmail.com'
          ) {
            userRole = 'admin';
          } else if (fbUser.email?.toLowerCase().includes('master')) {
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

  const registerUser = async (params: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
  }) => {
    setLoading(true);
    try {
      let uid = '';
      const trimmedEmail = params.email.trim();
      const trimmedName = params.name.trim();

      if (params.password) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, params.password);
          uid = cred.user.uid;
          await updateProfile(cred.user, { displayName: trimmedName });
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            const cred = await signInWithEmailAndPassword(auth, trimmedEmail, params.password);
            uid = cred.user.uid;
          } else {
            uid = 'u-' + Math.random().toString(36).substring(2, 10);
          }
        }
      } else {
        uid = 'u-' + Math.random().toString(36).substring(2, 10);
      }

      const profile: UserProfile = {
        uid,
        email: trimmedEmail,
        displayName: trimmedName,
        phone: params.phone.trim(),
        role: params.role,
        locale: language,
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', uid), profile, { merge: true });
      } catch (e) {
        console.warn('Firestore set user note:', e);
      }

      setUser(profile);
      localStorage.setItem('nine_star_user', JSON.stringify(profile));
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      let uid = '';
      let displayName = '求测人';
      let phone = '+60 12-345 6789';
      let role: UserRole = 'customer';

      try {
        const cred = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
        uid = cred.user.uid;
        displayName = cred.user.displayName || displayName;
      } catch (err: any) {
        // Fallback for demo credentials or offline
        uid = 'u-' + trimmedEmail.replace(/[^a-zA-Z0-9]/g, '_');
      }

      try {
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          const data = snap.data();
          role = data.role || role;
          displayName = data.displayName || displayName;
          phone = data.phone || phone;
        }
      } catch (e) {
        // fallback
      }

      const profile: UserProfile = {
        uid,
        email: trimmedEmail,
        displayName,
        phone,
        role,
        locale: language,
        createdAt: new Date().toISOString(),
      };

      setUser(profile);
      localStorage.setItem('nine_star_user', JSON.stringify(profile));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (roleOverride?: UserRole) => {
    try {
      setLoading(true);
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);

      let assignedRole: UserRole = roleOverride || 'customer';
      if (fbUser.email?.toLowerCase() === 'khimfatttai@gmail.com') {
        assignedRole = 'admin';
      } else if (snap.exists() && snap.data().role) {
        assignedRole = snap.data().role;
      }

      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || '求测人',
        photoURL: fbUser.photoURL,
        phone: snap.exists() ? snap.data().phone : '+60 12-345 6789',
        role: assignedRole,
        locale: language,
        createdAt: snap.exists() ? snap.data().createdAt : new Date().toISOString(),
      };

      await setDoc(userDocRef, profile, { merge: true });
      setUser(profile);
      localStorage.setItem('nine_star_user', JSON.stringify(profile));
    } catch (error) {
      console.warn('Google Sign In note:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInDemoUser = (role: UserRole) => {
    let mockProfile: UserProfile;
    if (role === 'admin') {
      mockProfile = {
        uid: 'admin-root-01',
        email: 'khimfatttai@gmail.com',
        displayName: '系统最高管理员',
        phone: '+60 12-888 8888',
        role: 'admin',
        locale: language,
        createdAt: '2024-01-01T00:00:00Z',
      };
    } else if (role === 'editor') {
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
        registerUser,
        loginUser,
        signInDemoUser,
        setUserProfile: setUser,
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
