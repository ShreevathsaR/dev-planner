import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { Link, router, Stack } from "expo-router";
import { useProjectsStore } from "@/lib/context/userStore";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Index() {
  const { user } = useAuth();
  const selectedProject = useProjectsStore((state) => state.selectedProject);

  useEffect(() => {
    if (selectedProject) {
      router.replace(`/${selectedProject.id}`);
    }
  }, [selectedProject]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: true,
        headerTitle: 'Welcome',
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#000',
        }
      }} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome{user?.displayName ? `, ${user.displayName}` : ''}!</Text>
          <Text style={styles.subtitle}>Manage your projects efficiently</Text>
        </View>

        <Link href={`/createProject?userId=${user?.uid}`} asChild>
          <TouchableOpacity style={styles.createButton}>
            <Feather name="plus" size={24} color="#fff" />
            <Text style={styles.buttonText}>Create New Project</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="rocket-outline" size={20} color="#696969" />
            <Text style={styles.featureText}>Quick project setup</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="settings-outline" size={20} color="#696969" />
            <Text style={styles.featureText}>Easy customization</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="bar-chart-outline" size={20} color="#696969" />
            <Text style={styles.featureText}>Track progress</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  createButton: {
    width: "100%",
    backgroundColor: "#121212",
    justifyContent:"center",
    alignItems:"center",
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#242424",
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  featuresContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  featureText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 15,
  },
});