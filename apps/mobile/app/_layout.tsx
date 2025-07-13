import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot, SplashScreen } from 'expo-router';
import { AuthProvider } from '@/lib/authContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Providers } from '@/lib/providers';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../firebaseConfig'

SplashScreen.preventAutoHideAsync();

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

export default function RootLayout() {


  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <Providers>
          <AuthProvider>
            <ProtectedRoute>
              <Slot />
            </ProtectedRoute>
            <Toast />
          </AuthProvider>
        </Providers>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}