import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useNavigation, useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { Text, TouchableOpacity, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../_layout";
import { useAuth } from "@/lib/authContext";
import FeatherIcon from "@expo/vector-icons/Feather";
import { DrawerActions } from "@react-navigation/native";
import { Image } from "expo-image";

export default function AppLayout() {
  const router = useRouter();
  const { user } = useAuth();

  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "black",
          paddingTop: 0,
        }}
      >
        <View
          style={{
            padding: 16,
            backgroundColor: "black",
            marginTop: 16,
            borderRadius: 10,
          }}
        ></View>
        <View style={{ flex: 1, backgroundColor: "black", gap: 2, padding: 0 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              padding: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text style={{ color: "gray", fontWeight: 500, fontSize: 20 }}>
                Projects
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "black",
                  borderWidth: 1,
                  borderColor: "gray",
                  padding: 8,
                  borderRadius: 10,
                }}
              >
                <FeatherIcon name="chevrons-left" size={24} color="white" />
              </Text>
            </TouchableOpacity>
          </View>
          <DrawerItemList {...props} />
        </View>
        <View
          style={{
            padding: 16,
            backgroundColor: "black",
            marginTop: 16,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image
                source={user?.photoURL}
                style={{ width: 40, height: 40, borderRadius: 20}}
              />
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {user?.displayName}
              </Text>
            </View>
            <TouchableOpacity onPress={handleSignOut}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "black",
                  borderWidth: 1,
                  borderColor: "gray",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerItemStyle: {
          borderRadius: 5,
        },
        drawerInactiveBackgroundColor: "black",
        drawerActiveBackgroundColor: "#242424",
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "white",
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 400,
        },
        drawerStyle: {
          borderRightWidth: 1,
          borderRightColor: "#242424",
          width: 360,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ title: "Home", drawerLabel: "Home" }}
      />
      <Drawer.Screen
        name="project1"
        options={{ title: "Project 1", drawerLabel: "Project 1" }}
      />
      <Drawer.Screen
        name="project2"
        options={{ title: "Project 2", drawerLabel: "Project 2" }}
      />
      <Drawer.Screen
        name="project3"
        options={{ title: "Project 3", drawerLabel: "Project 3" }}
      />
    </Drawer>
  );
}
