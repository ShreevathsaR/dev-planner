import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { Link, router } from "expo-router";
import Drawer from "expo-router/drawer";
import { signOut } from "firebase/auth";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../_layout";
import { Image } from "expo-image";
import { useAuth } from "@/lib/hooks/useAuth";
import Feather from "@expo/vector-icons/Feather";
import { useProjectsStore } from "@/lib/context/userStore";
import { trpcReact } from "../../trpc/client";
// import { trpcReact } from "@dev-planner/trpc/client";
import { useEffect } from "react";

export default function DrawerLayout() {
  const { user } = useAuth();
  const projects = useProjectsStore((state: any) => state.projects);
  const setSelectedProject = useProjectsStore(
    (state) => state.setSelectedProject
  );
  const selectedProject = useProjectsStore((state) => state.selectedProject);
  const setProjects = useProjectsStore((state) => state.setProjects);

  const {
    data: userProjects,
    error: projectFetchingError,
    isFetching,
  } = trpcReact.projectsRouter.getProjects.useQuery();
  console.log(userProjects?.message);

  useEffect(() => {
    if (userProjects && userProjects.data) {
      if (userProjects.data.length > 0) {
        const data = userProjects.data;
        setProjects(data);

        if (!selectedProject && data.length > 0) {
          setSelectedProject(data[0]);
          if (data[0]?.id) {
            router.replace(`/${data[0].id}`);
          }
        }
      } else {
        setProjects([]);
      }
    }

    if (projectFetchingError) {
      console.error("Error fetching user projects:", projectFetchingError);
    }
  }, [
    user,
    userProjects,
    setProjects,
    setSelectedProject,
    projectFetchingError,
  ]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setProjects([]);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isFetching) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="white" />
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

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
        <ScrollView
          style={{ flex: 1, backgroundColor: "black", gap: 2, padding: 0 }}
        >
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

          {projects && projects.length > 0 ? (
            projects.map((item: any) => {
              return (
                <DrawerItem
                  activeTintColor="white"
                  focused={selectedProject?.id === item.id}
                  style={{ borderRadius: 10, marginBottom: 5 }}
                  inactiveTintColor="white"
                  activeBackgroundColor="#242424"
                  labelStyle={{ color: "white" }}
                  key={item.id}
                  label={`${item.name}`}
                  onPress={() => {
                    if (item.id !== selectedProject?.id) {
                      setSelectedProject(item);
                    }
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
            <Link href={`/createProject?userId=${user?.uid}`} asChild>
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
        </ScrollView>
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
        <Drawer.Screen
          name="project"
          options={{ headerShown: false, headerTitle: "" }}
        />
        <Drawer.Screen
          name="index"
          options={{ headerShown: false, headerTitle: "" }}
        />
      </Drawer>
    </View>
  );
}
