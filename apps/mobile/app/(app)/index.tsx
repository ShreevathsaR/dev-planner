import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { router, Stack } from "expo-router";
import { useProjectsStore } from "@/lib/context/userStore";

export default function Index() {

  console.log("I hit index")

  const selectedProject = useProjectsStore((state) => state.selectedProject);

  useEffect(() => {
    if(selectedProject){
      console.log('Redirecting...', selectedProject);
      router.replace(`/${selectedProject.id}`);
    }
  }, [selectedProject]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true }} />
      <Text style={{ color: "white" }}>Loading...</Text>
      <ActivityIndicator size="large" color="white" />
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
