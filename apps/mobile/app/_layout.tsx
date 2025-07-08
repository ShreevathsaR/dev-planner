import {
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import {
  useEffect,
  useState,
} from "react";
import { Session } from "better-auth";
import { AuthContext } from "@/lib/authContext";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // useEffect(() => {
  //   console.log("isAuthorized", isAuthorized);
  //   async function getSession() {
  //     setIsLoading(true);
  //     console.log("Getting session...");
  //     try {
  //       const { data } = await authClient.getSession();
  //       if (data) {
  //         console.log("Session found");
  //         setSession(data?.session);
  //         setIsAuthorized(true);
  //       } else {
  //         setIsAuthorized(false);
  //         setSession(null);
  //         console.log("Session not found");
  //       }
  //       console.log(data?.session);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   getSession();
  // }, []);

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DefaultTheme}>
        <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
          <Stack          
            screenOptions={{
              headerShown: false,
              animation: "none",
            }}
          >
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
        </AuthContext.Provider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
