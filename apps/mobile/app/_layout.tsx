// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import { AuthContext } from "@/lib/authContext";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  User,
  initializeAuth,
} from "firebase/auth";
import { Text, View, ActivityIndicator, AppState } from "react-native";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import { Providers } from "@/lib/providers";
import Toast from "react-native-toast-message";

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appState = useRef(AppState.currentState);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const segments = useSegments();
  const router = useRouter();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user);

      if(user){
        try {
          await user.reload();
          const refreshedUser = auth.currentUser;
          setUser(refreshedUser);
        } catch (error) {
          console.error("Error reloading user:", error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
      SplashScreen.hideAsync();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  const subscription = AppState.addEventListener('change', async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      auth.currentUser
    ) {
      try {
        await auth.currentUser.reload();
      } catch (error) {
        console.error('Failed to reload user:', error);
      }
    }
    appState.current = nextAppState;
  });

  return () => subscription?.remove();
}, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    console.log("User:", user?.displayName);
    console.log("Email verified:", user?.emailVerified);
    console.log("Current segments:", segments);

    if (user && user.emailVerified) {
      if (inAuthGroup) {
        console.log("Verified user in auth group, redirecting to app");
        router.replace("/(app)/project1");
      }
    } else if (user && !user.emailVerified) {
      if (inAppGroup) {
        console.log("Unverified user in app group, redirecting to auth");
        Toast.show({
          type: "info",
          text1: "Email Verification Required",
          text2: "Please verify your email to continue",
        });
        router.replace("/(auth)/sign-in");
      }
    } else if (!user) {
      if (inAppGroup) {
        console.log("No user in app group, redirecting to auth");
        router.replace("/(auth)/sign-in");
      } else if (!inAuthGroup) {
        router.replace("/(auth)");
      }
    }
  }, [user, segments, isLoading, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#666" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <Providers>
          <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
            <Slot />
          </AuthContext.Provider>
        </Providers>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
