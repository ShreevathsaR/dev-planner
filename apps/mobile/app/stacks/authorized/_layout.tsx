import { authClient } from "@/lib/auth-client";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Session } from "better-auth";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const AuthorizedStack = () => {

    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const CustomDrawerContent = (props: DrawerContentComponentProps) => {
        return (
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props}/>
                <View style={{ padding: 16, backgroundColor: "red", marginBottom: 16 }}>
                  <TouchableOpacity onPress={() => router.push("/sign-in")}>
                    <Text style={{ color: "white" }}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
            </DrawerContentScrollView>
        )
    }

  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveBackgroundColor: "gray",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerLabelStyle: {
            fontSize: 16,
          },
          drawerStyle: {
            backgroundColor: "blue",
            width: 350,
            flex: 1,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
        }}
      >
        <Drawer.Screen name="project1" options={{ title: "Project 1" }} />
        <Drawer.Screen name="project2" options={{ title: "Project 2" }} />
        <Drawer.Screen name="project3" options={{ title: "Project 3" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default AuthorizedStack;
