import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { SelectProvider } from "@mobile-reality/react-native-select-pro";

export default function ProjectDetailsLayout() {
  return (
    <SelectProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="projectDetails" />
        <Stack.Screen
          name="createProject"
          options={{
            headerShown: false,
            headerBackground: () => {
              return <View style={{ backgroundColor: "black", height: 100 }} />;
            },
            headerTitle: "Create Project",
            headerTitleAlign: "center",
            headerShadowVisible: true,
            headerTitleStyle: { color: "white" },
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => router.back()}>
                  <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
              );
            },
          }}
        />
        <Stack.Screen
          name="moreProjectDetails"
          options={{
            headerShown: false,
            headerBackground: () => {
              return <View style={{ backgroundColor: "black", height: 100 }} />;
            },
            headerTitle: "Create Project",
            headerTitleAlign: "center",
            headerShadowVisible: true,
            headerTitleStyle: { color: "white" },
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => router.back()}>
                  <Icon name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
              );
            },
          }}
        />
      </Stack>
    </SelectProvider>
  );
}

const styles = StyleSheet.create({});
