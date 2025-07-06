import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Drawer } from "expo-router/drawer";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerActiveTintColor: "gray",
          }}
        >
          <Drawer.Screen
            name="sign-in"
            options={{
              drawerLabel: "SignIn Screen",
              headerTitle: "SignIn",
            }}
          />
          <Drawer.Screen
            name="sign-up"
            options={{
              drawerLabel: "SignUp Screen",
              headerTitle: "SignUp",
            }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{
              drawerLabel: "Not Found Screen",
              headerTitle: "Not Found 404",
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
