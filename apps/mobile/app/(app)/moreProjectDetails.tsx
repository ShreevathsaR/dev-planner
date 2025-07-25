import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import MultiSelect from "react-native-multiple-select";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { createProjectType } from "@/lib/types";
import { trpcReact } from "../../trpc/client";
import { useProjectsStore } from "@/lib/context/userStore";
import Feather from "@expo/vector-icons/Feather";

export default function MoreProjectDetails() {
  const params = useLocalSearchParams();
  const projectData = JSON.parse(params.data as string);

  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<any>([]);
  const [timeline, setTimeline] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    skills: "",
    timeline: "",
  });

  const setSelectedProject = useProjectsStore(
    (state) => state.setSelectedProject
  );
  const selectedProject = useProjectsStore((state) => state.selectedProject);
  const addProject = useProjectsStore((state) => state.addProject);

  const createProject = trpcReact.projectsRouter.createProject.useMutation({
    onSuccess: async ({ data }: any) => {
      addProject(data);
      setSelectedProject(data);
      Toast.show({
        type: "success",
        text1: "Project created successfully",
        visibilityTime: 2000,
      });
      setIsLoading(false);
      router.replace("/");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error creating project",
        text2: error.data?.code,
        visibilityTime: 2000,
      });
      setIsLoading(false);
    },
  });

  const skillOptions = [
    { label: "React", value: "React" },
    { label: "Node.js", value: "Node.js" },
    { label: "PostgreSQL", value: "PostgreSQL" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "JavaScript", value: "JavaScript" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "Go", value: "Go" },
    { label: "Ruby", value: "Ruby" },
    { label: "PHP", value: "PHP" },
    { label: "MySQL", value: "MySQL" },
    { label: "MongoDB", value: "MongoDB" },
    { label: "Redis", value: "Redis" },
    { label: "GraphQL", value: "GraphQL" },
    { label: "REST API", value: "REST API" },
    { label: "Docker", value: "Docker" },
    { label: "Kubernetes", value: "Kubernetes" },
    { label: "AWS", value: "AWS" },
    { label: "Azure", value: "Azure" },
    { label: "GCP", value: "GCP" },
    { label: "Next.js", value: "Next.js" },
    { label: "Express.js", value: "Express.js" },
    { label: "Django", value: "Django" },
    { label: "Flask", value: "Flask" },
    { label: "React Native", value: "React Native" },
    { label: "Vue.js", value: "Vue.js" },
    { label: "Angular", value: "Angular" },
    { label: "SQL", value: "SQL" },
    { label: "Prisma", value: "Prisma" },
    { label: "TailwindCSS", value: "TailwindCSS" },
  ];

  const onSubmit = useCallback(() => {
    if (!projectData) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Project data is missing",
        visibilityTime: 2000,
      });
      return;
    }

    console.log({ skills, timeline });
    setIsLoading(true);

    if (skills.length === 0) {
      setErrorMessage((state) => ({
        ...state,
        skills: "Please select at least one skill",
      }));
      setIsLoading(false);
      return;
    }
    if (timeline === "") {
      setErrorMessage((state) => ({
        ...state,
        timeline: "Please enter a timeline",
      }));
      setIsLoading(false);
      return;
    }

    createProject.mutate({
      ...projectData,
      details: {
        ...projectData.details,
        skills,
        timeline,
      },
    });
  }, [projectData, skills, timeline, createProject]);

  const handleSkip = useCallback(() => {
    if (!projectData) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Project data is missing",
        visibilityTime: 2000,
      });
      return;
    }

    setIsLoading(true);
    createProject.mutate({ ...projectData });
  }, [projectData, createProject]);

  const handleSkillsChange = useCallback((items: any) => {
    setSkills(items);
    setErrorMessage((state) => ({
      ...state,
      skills: "",
    }));
  }, []);

  const handleTimelineChange = useCallback((text: string) => {
    setTimeline(text);
    setErrorMessage((state) => ({
      ...state,
      timeline: "",
    }));
  }, []);

  // Show loading or error state if projectData is not available
  if (!projectData) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 5, padding: 10 }}>
                  <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
              );
            },
            headerShown: true,
            headerTitle: "",
            headerBackground: () => {
              return (
                <View style={{ backgroundColor: "black", height: 100 }}></View>
              );
            },
          }}
        />
        <View
          style={[
            styles.formContainer,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.label}>Loading project data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => {
            return (
              <Link href="/" style={{ marginLeft: 10 }}>
                <Feather name="arrow-left" size={24} color="white" />
              </Link>
            );
          },
          headerShown: true,
          headerTitle: "",
          headerBackground: () => {
            return (
              <View style={{ backgroundColor: "black", height: 100 }}></View>
            );
          },
        }}
      />
      <View style={styles.formContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Would you like to update project's timeline and team skills?
          </Text>
        </View>

        {isLoading && (
          <ActivityIndicator size="large" color="white" animating={isLoading} />
        )}

        {/* Skills Selection */}
        <View style={styles.multiSelectInputContainer}>
          <Text style={styles.label}>Skills</Text>
          <MultiSelect
            items={skillOptions}
            uniqueKey="value"
            hideSubmitButton={true}
            styleInputGroup={{
              backgroundColor: "black",
              borderRadius: 10,
              padding: 10,
              borderColor: "#242424",
              borderWidth: 1,
            }}
            onSelectedItemsChange={handleSkillsChange}
            selectedItems={skills}
            selectText="Select Skills"
            searchInputPlaceholderText="Search Skills..."
            styleItemsContainer={{ borderRadius: 10 }}
            styleDropdownMenu={{ borderRadius: 10 }}
            altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="lightgray"
            selectedItemIconColor="#CCC"
            itemTextColor="white"
            displayKey="label"
            searchInputStyle={{ color: "#CCC" }}
            submitButtonColor="#CCC"
            styleMainWrapper={{
              backgroundColor: "black",
              borderRadius: 10,
              padding: 10,
              borderColor: "#242424",
              borderWidth: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
            styleListContainer={{
              backgroundColor: "black",
              borderRadius: 10,
              maxHeight: 200,
              borderWidth: 2,
              borderColor: "#242424",
            }}
            styleDropdownMenuSubsection={{
              backgroundColor: "black",
              borderRadius: 10,
              borderWidth: 0,
              padding: 20,
              borderBottomColor: "#242424",
            }}
          />
        </View>
        {errorMessage.skills && (
          <Text style={styles.errorMessage}>{errorMessage.skills}</Text>
        )}

        {/* Timeline Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Timeline</Text>
          <TextInput
            style={[styles.input, styles.textAreaInput]}
            value={timeline}
            onChangeText={handleTimelineChange}
            placeholder="Enter timeline (e.g., 3 months)"
            placeholderTextColor="#6B7280"
            multiline
          />
        </View>
        {errorMessage.timeline && (
          <Text style={styles.errorMessage}>{errorMessage.timeline}</Text>
        )}

        <TouchableOpacity
          style={styles.signInButton}
          onPress={onSubmit}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 20,
  },
  formContainer: {
    marginBottom: 100,
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#000000",
    borderWidth: 0,
    borderColor: "gray",
    borderRadius: 10,
    padding: 25,
  },
  header: {
    marginBottom: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  multiSelectInputContainer: {
    marginBottom: 16,
    zIndex: 10,
    position: "relative",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#242424",
    borderRadius: 6,
    backgroundColor: "#000000",
    color: "white",
    fontSize: 16,
  },
  multiSelect: {
    height: 50,
    backgroundColor: "#000000",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#242424",
    paddingHorizontal: 12,
  },
  dropdownMenu: {
    backgroundColor: "#000000",
    borderRadius: 8,
    position: "relative",
  },
  itemText: {
    fontSize: 16,
    color: "white",
  },
  selectedItem: {
    backgroundColor: "#242424",
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#121212",
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#242424",
  },
  skipButton: {
    width: "100%",
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#242424",
  },
  signInButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  skipButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorMessage: {
    color: "lightcoral",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 20,
  },
});
