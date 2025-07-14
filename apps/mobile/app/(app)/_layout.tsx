import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Link,
  router,
  useNavigation,
  usePathname,
  useSegments,
} from "expo-router";
import Drawer from "expo-router/drawer";
import { signOut } from "firebase/auth";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../_layout";
import { Image } from "expo-image";
import { useAuth } from "@/lib/hooks/useAuth";
import { projects } from "@/lib/sample";
import Feather from "@expo/vector-icons/Feather";

export default function DrawerLayout() {
  const { user } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigation = useNavigation();

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
          </View>
          {/* <DrawerItemList {...props} /> */}

          {projects.length > 0 ? (
            projects.map((item) => {
              return (
                <DrawerItem
                  activeTintColor="white"
                  focused={pathname === `/${item.id}`}
                  style={{ borderRadius: 10, marginBottom: 5 }}
                  inactiveTintColor="white"
                  activeBackgroundColor="#242424"
                  labelStyle={{ color: "white" }}
                  key={item.id}
                  label={`Project ${item.name}`}
                  onPress={() => {
                    router.push(`/${item.id}`);
                  }}
                  {...props}
                />
              );
            })
          ) : (
            <View
              style={{
                padding: 10,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={{ color: "lightgray" }}>No projects found</Text>
            </View>
          )}
          <View
            style={{
              padding: 10,
              backgroundColor: "black",
              alignItems: "center",
            }}
          >
            <Link href={`/project/createProject?userId=${user?.uid}`} asChild>
              <TouchableOpacity
                style={{
                  backgroundColor: "lightgray",
                  borderWidth: 1,
                  borderColor: "gray",
                  padding: 10,
                  borderRadius: 10,
                  flexDirection: "row",
                  gap: 7,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="plus" size={24} color="black" />
                <Text style={{ fontWeight: "bold" }}>Create Project</Text>
              </TouchableOpacity>
            </Link>
          </View>
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
                style={{ width: 40, height: 40, borderRadius: 20 }}
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
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerItemStyle: {
            borderRadius: 5,
          },
          headerShown: true,
          drawerInactiveBackgroundColor: "black",
          drawerActiveBackgroundColor: "#242424",
          drawerActiveTintColor: "white",
          drawerInactiveTintColor: "white",
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: 400,
            color: "white",
          },
          drawerStyle: {
            borderRightWidth: 1,
            borderRightColor: "#242424",
            width: 360,
          },
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
        }}
      >
        <Drawer.Screen name="project" options={{ headerShown: true, headerTitle: "" }} />
      </Drawer>
    </View>
  );
}
