import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { auth } from "../_layout";
import { Link, router } from "expo-router";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Toast from "react-native-toast-message";
import { Controller, set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@dev-planner/schema";
import { trpcReact } from "@dev-planner/trpc";
import { handleGoogleSignIn } from "@/lib/auth/googleSignIn";
import { sendVerificationEmail } from "@/lib/auth/sendVerificationEmail";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const { email, password } = data;

    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign-in response:", response.user);

      await response.user.reload();
      const refreshedUser = auth.currentUser;
      if (!refreshedUser?.emailVerified) {
        console.log("User is not verified");
        Toast.show({
          type: "success",
          text1: "Verification mail sent",
          text2: "Please verify your email to continue",
        });
        await sendVerificationEmail(response.user);
        await auth.signOut();
        setIsLoading(false);
        return
      }
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Logged in successfully",
      });
      setIsLoading(false);
      router.replace("/(app)/project1");
    } catch (error: any) {
      let errorMessage = "An error occurred during login";
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            errorMessage = "Google Sign-In was cancelled";
            break;
          case statusCodes.IN_PROGRESS:
            errorMessage = "Google Sign-In is already in progress";
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            errorMessage = "Google Play Services is not available";
            break;
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

  const registerUserMutation = trpcReact.user.registerUser.useMutation({
    onSuccess: async ({user}) => {
      console.log(user)
      setIsLoading(false);
    },
    onError: async (error) => {
      console.log(error);
      if (error.data?.code === "CONFLICT") {
        setIsLoading(false);
      }
      setIsLoading(false);
      return Toast.show({
        text1: "Failed storing user",
        text2: error.message,
      });
    },
  });

  return (
    <View style={styles.container}>
      <Toast position="top" bottomOffset={30} visibilityTime={2000} />
      <View style={styles.formContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>
        {isLoading && (
          <ActivityIndicator size="large" color="white" animating={isLoading} />
        )}
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text style={styles.signInButtonText}>
            {isLoading ? "Signing in.." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google Sign In */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => handleGoogleSignIn({ setIsLoading, registerUserMutation })}
          disabled={isLoading}
        >
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Link href={"/sign-up"}>
            <Text style={styles.signUpLink}>Sign up</Text>
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
