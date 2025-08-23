import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, loading, signInAnonymously, signOut } = useAuth();

  // Auto sign-in anonymously if no user is present
  React.useEffect(() => {
    if (!loading && !user) {
      console.log('🔐 Auto-signing in anonymously...');
      signInAnonymously();
    }
  }, [loading, user, signInAnonymously]);

  const value = {
    user,
    loading,
    signInAnonymously,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}