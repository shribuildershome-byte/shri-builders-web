import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config.ts';
import {
  adminSignIn,
  adminSignOut,
  sendAdminPasswordReset,
  verifyAdminAuthorization,
} from '../firebase/services.ts';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  isConfigured: false,
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  authError: null,
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const isConfigured = isFirebaseConfigured();

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const check = await verifyAdminAuthorization(currentUser);
          setIsAdmin(check.isAuthorized);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const loggedInUser = await adminSignIn(email, pass);
      const check = await verifyAdminAuthorization(loggedInUser);
      if (!check.isAuthorized) {
        // User logged in, but their UID is not on the admin allowlist
        setIsAdmin(false);
        await adminSignOut();
        throw new Error(
          check.reason ||
            'Access Denied: This account is authenticated with Firebase, but is not on the authorized Admin UID allowlist for SHRI BUILDERS.'
        );
      }
      setIsAdmin(true);
    } catch (err: any) {
      let msg = err.message || 'Login failed';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid credentials. Only pre-created, authorized admin accounts can sign in.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please reset your password or try again later.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    await adminSignOut();
    setUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendAdminPasswordReset(email);
    } catch (err: any) {
      let msg = err.message || 'Failed to send password reset email';
      if (err.code === 'auth/user-not-found') {
        msg = 'No authorized admin account found with that email address.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        isConfigured,
        login,
        logout,
        resetPassword,
        authError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
