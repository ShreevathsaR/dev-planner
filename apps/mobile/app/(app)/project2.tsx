import { useAuth } from "@/lib/authContext";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../_layout";
const Root = () => {

  const router = useRouter();
  // const { setIsAuthorized } = useAuth();

  const handleSignOut = async() => {
    await signOut(auth);
    // router.replace("/(auth)/sign-in");
  }

  return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 32 }}>
          Authorized stacks here
        </Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={{ color: "white" }}>Sign out</Text>
        </TouchableOpacity>
      </View>
  );
};

export default Root;
