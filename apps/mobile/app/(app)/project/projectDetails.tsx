import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSearchParams } from 'expo-router/build/hooks'

export default function ProjectDetails() {

  const projectId = useSearchParams().get('projectId')

  return (
    <View style={{backgroundColor:"black", flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={{color:"white", fontSize:24}}> Project Details of {projectId} here</Text>
    </View>
  )
}

const styles = StyleSheet.create({})