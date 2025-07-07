import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Session } from "better-auth";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getSession() {
      setIsLoading(true);
      console.log("Getting session...");
      try {
        const { data } = await authClient.getSession();
        if (data) {
          setSession(data?.session);
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getSession();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{
          headerShown: false,
          animation: "none",
        }}>
          <Stack.Protected guard={isAuthorized}>
            <Stack.Screen
              name="stacks/authorized"
              options={{
                title: "Authorized",
              }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!isAuthorized}>
          <Stack.Screen
            name="sign-up"
            options={{
              title: "Sign-Up",
            }}
          />
          <Stack.Screen
            name="sign-in"
            options={{
              title: "Sign-In",
            }}
          />
          </Stack.Protected>
        </Stack>
    </ThemeProvider>
  );
}
