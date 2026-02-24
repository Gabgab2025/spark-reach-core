/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Match backend schemas.User
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string | null;
}

// Match backend schemas.TokenResponse
export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface SessionResponse {
  session: Session | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; user: User | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Normalize user role to lowercase — backend may return 'ADMIN' or 'Admin'
  const normalizeUser = (u: User): User => ({ ...u, role: u.role?.toLowerCase() ?? 'user' });

  useEffect(() => {
    const checkSession = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Token exists in localStorage — validate it with the backend
        const { data, error } = await api.get<SessionResponse>('/auth/session');

        if (data?.session) {
          // Backend returned a fresh token — keep it
          setAuthToken(data.session.access_token);
          const normalized = normalizeUser(data.session.user);
          setUser(normalized);
          setSession({ ...data.session, user: normalized });
        } else {
          // Token invalid / expired
          clearAuthToken();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await api.post<SessionResponse>('/auth/signup', {
      email,
      password,
      full_name: fullName,
    });

    if (error) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data?.session) {
      setAuthToken(data.session.access_token);
      const normalized = normalizeUser(data.session.user);
      setUser(normalized);
      setSession({ ...data.session, user: normalized });
      toast({
        title: 'Account created!',
        description: 'You are now signed in.',
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await api.post<SessionResponse>('/auth/login', {
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data?.session) {
      setAuthToken(data.session.access_token);
      const normalized = normalizeUser(data.session.user);
      setUser(normalized);
      setSession({ ...data.session, user: normalized });
    }

    return { error, user: data?.session?.user ? normalizeUser(data.session.user) : null };
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Ignore — stateless JWT, just clear client state
    } finally {
      clearAuthToken();
      setUser(null);
      setSession(null);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};