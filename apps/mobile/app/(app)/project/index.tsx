import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'

export default function Index() {
  return (
    <View style={{backgroundColor:"black", flex:1, justifyContent:"center", alignItems:"center"}}>
      <Stack.Screen options={{ headerLeft: () => {
        return (
          <Link href="/" style={{marginLeft:10}}>
            <Feather name="arrow-left" size={24} color="white" />
          </Link>
        )
      }, headerTitle:"", headerBackground: () => {
        return (
          <View style={{backgroundColor:"black", height:100}}></View>
        )
      } }} />
      <Text style={{color:"white", fontSize:24}}> Index </Text>
      <Link href="/project/projectDetails">
      <Text style={{color:"white", fontSize:24}}> Screen 1 </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({})