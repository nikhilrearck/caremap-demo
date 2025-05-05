import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean; 
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false, 
  setUser: () => {},
  signOut: async () => {},
});


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await SecureStore.getItemAsync('user');
        console.log("Loaded user data:", userData);
        
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        await SecureStore.deleteItemAsync('user');
      } finally {
        setIsLoading(false); // THIS WAS MISSING
      }
    };
    
    loadUser();
  }, []);

  const signOut = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);