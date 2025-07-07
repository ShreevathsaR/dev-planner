import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Root = () => {

  const router = useRouter();

  const handleSignOut = async() => {
    try {
        const response = await authClient.signOut()
        if(response.data?.success){
            router.replace('/sign-in')
        }
        console.log(response)
    } catch (error) {
        console.error(error)
    }
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
        <TouchableOpacity onPress={() => handleSignOut()}>
          <Text style={{ color: "white" }}>Sign out</Text>
        </TouchableOpacity>
      </View>
  );
};

export default Root;
