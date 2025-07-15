import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/app/_layout'; 
import { queryClient, trpcClient } from '../trpc';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await firebaseUser.reload();
          const refreshedUser = auth.currentUser;
          setUser(refreshedUser);
        } catch (error) {
          console.error('Failed to reload user:', error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        queryClient.clear();
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!(user && user.emailVerified),
  };
};