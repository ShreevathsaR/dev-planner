import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Link, router, Stack } from "expo-router";
import { useProjectsStore } from "@/lib/context/userStore";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Index() {
  console.log("I hit index");
  const { user } = useAuth();

  const selectedProject = useProjectsStore((state) => state.selectedProject);

  useEffect(() => {
    if (selectedProject) {
      console.log("Redirecting...", selectedProject);
      router.replace(`/${selectedProject.id}`);
    }
  }, [selectedProject]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true }} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
