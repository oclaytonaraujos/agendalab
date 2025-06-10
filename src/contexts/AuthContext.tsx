
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordenacao' | 'professor';
  departamento?: string;
  telefone?: string;
  status: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userData: { name: string; role: string; departamento?: string; telefone?: string }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para validar e converter o role
const validateRole = (role: string): 'admin' | 'coordenacao' | 'professor' => {
  if (role === 'admin' || role === 'coordenacao' || role === 'professor') {
    return role;
  }
  return 'professor'; // default fallback
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        
        // Se o perfil não existe, criar um perfil básico
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating default profile');
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser.user) {
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                name: authUser.user.email?.split('@')[0] || 'Usuário',
                email: authUser.user.email || '',
                role: 'professor'
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
              return null;
            }
            
            return {
              id: newProfile.id,
              name: newProfile.name,
              email: newProfile.email,
              role: validateRole(newProfile.role),
              departamento: newProfile.departamento,
              telefone: newProfile.telefone,
              status: newProfile.status
            };
          }
        }
        return null;
      }

      // Converter o profile para o tipo UserProfile com validação
      const userProfile: UserProfile = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: validateRole(profile.role),
        departamento: profile.departamento,
        telefone: profile.telefone,
        status: profile.status
      };

      console.log('User profile loaded:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUser(profile);
            console.log('Profile set successfully');
          } else {
            console.log('Failed to load profile');
          }
        } else {
          console.log('No session, clearing user');
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          if (profile) {
            setUser(profile);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      console.log('Login successful:', data);
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUser(profile);
        }
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userData: { name: string; role: string; departamento?: string; telefone?: string }
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Attempting signup for:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            departamento: userData.departamento,
            telefone: userData.telefone
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        setIsLoading(false);
        return false;
      }

      console.log('Signup successful:', data);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, signup, isLoading }}>
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
