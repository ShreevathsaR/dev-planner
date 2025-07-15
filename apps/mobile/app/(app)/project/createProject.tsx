import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "expo-router/build/hooks";
import { Link, router, Stack, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigate } from "expo-router/build/global-state/routing";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native-gesture-handler";
import { trpcReact } from "@dev-planner/trpc";
import { Controller, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "@dev-planner/schema";
import * as z from "zod";
import Icon from "@expo/vector-icons/Feather";
import SelectDropdown from "react-native-select-dropdown";
import { useAuth } from "@/lib/hooks/useAuth";
import Feather from "@expo/vector-icons/Feather";
import { useProjectsStore } from "@/lib/context/userStore";

export default function CreateProject() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const selectedProject = useProjectsStore((state) => state.selectedProject);
  const { user } = useAuth();

  const budgetOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const teamSizeOptions = [
    { label: "1-10", value: 10 },
    { label: "10-25", value: 25 },
    { label: "25-50", value: 50 },
    { label: "50-100", value: 100 },
    { label: "100+", value: 100 },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      createdBy: user?.uid,
      description: "",
      details: {
        teamSize: 10,
        skills: [],
        budget: "medium",
        timeline: "",
      },
    },
  });
  useEffect(() => {
    setValue("createdBy", user?.uid || "123", { shouldValidate: true });
  }, [user, setValue]);

  const onSubmit = async (data: z.infer<typeof createProjectSchema>) => {
    setIsLoading(true);
    console.log(data);
    if (user) {
      router.replace({
        pathname: "./moreProjectDetails",
        params: {
          data: encodeURIComponent(JSON.stringify(data)),
        },
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Error creating project",
        text2: "You must be logged in to create a project",
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => {
            return (
              <Link href={selectedProject ? `/${selectedProject.id}` : '/(app)/'} style={{ marginLeft: 5, padding: 10 }}>
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
          <Text style={styles.title}>Create a project</Text>
        </View>

        {isLoading && (
          <ActivityIndicator size="large" color="white" animating={isLoading} />
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Project name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter your project's name"
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                autoCapitalize="none"
              />
            )}
          />
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                multiline
                style={[styles.input, styles.textAreaInput]}
                value={value}
                onChangeText={onChange}
                placeholder="Describe your project"
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                autoCapitalize="none"
              />
            )}
          />
          {errors.description && (
            <Text style={styles.error}>{errors.description.message}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Budget</Text>
          <Controller
            control={control}
            name="details.budget"
            render={({ field: { onChange, value } }) => (
              <SelectDropdown
                data={budgetOptions}
                onSelect={(selectedItem) => onChange(selectedItem.value)}
                defaultValue={budgetOptions.find(
                  (option) => option.value === value
                )}
                renderButton={(selectedItem, isOpened) => (
                  <View style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>
                      {(selectedItem && selectedItem.label) || "Select Budget"}
                    </Text>
                    <Icon
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#1F2937"
                    />
                  </View>
                )}
                renderItem={(item, index, isSelected) => (
                  <View
                    key={index}
                    style={[
                      styles.dropdownItem,
                      isSelected && { backgroundColor: "#696969" },
                    ]}
                  >
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                dropdownStyle={styles.dropdownMenu}
                showsVerticalScrollIndicator={false}
              />
            )}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Team Size</Text>
          <Controller
            control={control}
            name="details.teamSize"
            render={({ field: { onChange, value } }) => (
              <SelectDropdown
                data={teamSizeOptions}
                onSelect={(selectedItem) => onChange(selectedItem.value)}
                defaultValue={teamSizeOptions.find(
                  (option) => option.value === value
                )}
                renderButton={(selectedItem, isOpened) => (
                  <View style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>
                      {(selectedItem && selectedItem.label) ||
                        "Select Team Size"}
                    </Text>
                    <Icon
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#1F2937"
                    />
                  </View>
                )}
                renderItem={(item, index, isSelected) => (
                  <View
                    key={index}
                    style={[
                      styles.dropdownItem,
                      isSelected && { backgroundColor: "#696969" },
                    ]}
                  >
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </View>
                )}
                dropdownStyle={styles.dropdownMenu}
                showsVerticalScrollIndicator={false}
              />
            )}
          />
        </View>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.signInButtonText}>Create</Text>
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
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  inputContainer: {
    marginBottom: 16,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#6B7280",
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
  signInButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#999999",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#6B7280",
  },
  googleButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#242424",
    paddingVertical: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  googleButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "#6B7280",
    fontSize: 16,
  },
  signUpLink: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  error: {
    color: "lightcoral",
    fontSize: 12,
    marginTop: 4,
  },
  dropdownButton: {
    height: 50,
    backgroundColor: "black",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#242424",
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownButtonText: { fontSize: 16, color: "white" },
  dropdownMenu: { backgroundColor: "black", borderRadius: 8 },
  dropdownItem: { padding: 12 },
  dropdownItemText: { fontSize: 16, color: "white" },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  multiSelect: {
    height: 50,
    backgroundColor: "black",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#242424",
    paddingHorizontal: 12,
  },
  itemText: { fontSize: 16, color: "black" },
  selectedItem: { backgroundColor: "red" },
  selectedItemText: { color: "white" },
});
