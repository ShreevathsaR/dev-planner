// app/(auth)/sign-up.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import { auth } from "../_layout";
import { Link, router } from "expo-router";
import Toast from "react-native-toast-message";
import { HelloWave } from "@/components/HelloWave";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@dev-planner/schema";
import { handleGoogleSignIn } from "@/lib/auth/googleSignIn";
import { trpcReact } from "@dev-planner/trpc";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  const registerUserMutation = trpcReact.user.registerUser.useMutation({
    onSuccess: async ({ user }) => {
      console.log(user);
      if (auth.currentUser) {
        sendEmailVerification(auth.currentUser!);
        Toast.show({
          type: "success",
          text1: "Email Verification Sent",
          text2: "Please check your email to verify your account.",
        });
      }
      setIsLoading(false);
    },
    onError: async (error) => {
      console.log(error);
      if (error.data?.code === "CONFLICT") {
        if (auth.currentUser) {
          sendEmailVerification(auth.currentUser!);
          Toast.show({
            type: "success",
            text1: "Email Verification Sent",
            text2: "Please check your email to verify your account.",
          });
        }
      } else {
        setIsLoading(false);
        return Toast.show({
          text1: "Failed storing user",
          text2: error.message,
        });
      }
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    console.log("Submitting data", data);
    const { name: username, email, password } = data;
    if (!email || !password || !username) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Password must be at least 6 characters",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // console.log("User created", response.user);
      if (!response.user) {
        throw new Error("User creation failed");
      }
      await updateProfile(response.user, {
        displayName: username,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          username
        )}`,
      });
      const { uid } = response.user;
      registerUserMutation.mutate({
        name: username,
        email,
        id: uid,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          username
        )}`,
      });
    } catch (error: any) {
      console.log(error.code);
      
      let errorMessage = "An error occurred during signup";
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-credential":
            errorMessage = "Invalid credentials";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email";
            break;
          case "auth/user-disabled":
            errorMessage = "User is disabled";
            break;
          case "auth/user-not-found":
            errorMessage = "User not found";
            break;
          case "auth/wrong-password":
            errorMessage = "Wrong password";
            break;
          case "auth/email-already-in-use":
            errorMessage = "Email already in use";
            break;
          default:
            errorMessage = error.message || JSON.stringify(error);
        }
      }
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Toast position="top" bottomOffset={30} visibilityTime={2000} />
      </View>

      <View style={styles.formContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome <HelloWave />
          </Text>
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        {isLoading && (
          <ActivityIndicator size="large" color="white" animating={isLoading} />
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter your name"
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
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.signInButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() =>
            handleGoogleSignIn({ registerUserMutation, setIsLoading() {} })
          }
        >
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Link href={"/sign-in"}>
            <Text style={styles.signUpLink}>Sign In</Text>
          </Link>
        </View>
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
});
