// app/_layout.tsx
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { AuthContext } from "@/lib/authContext";
import { getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebaseConfig";
import { getAuth, onAuthStateChanged, User, initializeAuth} from "firebase/auth";
import { Text, View, ActivityIndicator } from "react-native";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      SplashScreen.hideAsync();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    if (user && inAuthGroup) {
      // User is signed in but in auth group, redirect to app
      router.replace("/(app)/project1");
    } else if (!user && inAppGroup) {
      // User is not signed in but in app group, redirect to auth
      router.replace("/(auth)/sign-in");
    } else if (!user && !inAuthGroup && !inAppGroup) {
      // Initial state, no user, redirect to auth
      router.replace("/(auth)");
    } else if (user && !inAuthGroup && !inAppGroup) {
      // Initial state, user exists, redirect to app
      router.replace("/(app)/project1");
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#ffffff"
      }}>
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
        <AuthContext.Provider value={{ user, isAuthenticated: !!user }}>
          <Slot />
        </AuthContext.Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}