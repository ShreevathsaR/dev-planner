import { useAuth } from '@/lib/authContext';
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Image } from 'expo-image';

export default function Project1 (){
  const { user } = useAuth();

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
        <Image source={user?.photoURL} style={{ width: 100, height: 100, borderRadius: 50 }} />
        <Text style={{ color: "white" }}>Welcome to Project 1, {user?.displayName}</Text>
      </View>
    )
}
