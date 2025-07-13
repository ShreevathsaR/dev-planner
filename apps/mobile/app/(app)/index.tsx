import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function index() {
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
