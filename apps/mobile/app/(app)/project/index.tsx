import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function Index() {
  return (
    <View style={{backgroundColor:"black", flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={{color:"white", fontSize:24}}> Index </Text>
      <Link href="/project/projectDetails">
      <Text style={{color:"white", fontSize:24}}> Screen 1 </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({})