import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";
import { useAuth } from "@/lib/authContext";
import { auth } from "@/firebaseConfig";
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signInWithRedirect } from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function SignIn() {
  const [email, setEmail] = useState("vathsaworks@gmail.com");
  const [password, setPassword] = useState("Vathsa@123");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthorized } = useAuth();
  const auth = getAuth();

  // async function handleLogin() {
  //   setIsLoading(true);
  //   Keyboard.dismiss();
  //   try {
  //     const response = await authClient.signIn.email({
  //       email: "vathsaworks@gmail.com",
  //       password: "Vathsa@123",
  //     });

  //     if (response.error) {
  //       return Toast.show({
  //         type: "error",
  //         text1: "Sign in failed",
  //         text2: response.error.message || "",
  //       });
  //     }

  //     Toast.show({
  //       type: "success",
  //       text1: "Success",
  //       text2: `Logged in as ${response.data.user.name}` || "",
  //     });
  //     console.log(response);
  //     setIsAuthorized(true);
  //   } catch (error) {
  //     console.error(error);
  //     return Toast.show({
  //       type: "error",
  //       text1: "Sign in failed",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  // const handleGoogleSignIn = async () => {
  //   setIsLoading(true);

  //   try {
  //     const response = await authClient.signIn.social({
  //       provider: "googleMobile",
  //       callbackURL: "devplanner://auth/callback",
  //     });
  //     console.log(response);
  //   } catch (error) {
  //     // toast.error("Error signing up with google");
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(data?.idToken);
      await signInWithCredential(auth, googleCredential);
      // await syncUser(); // Sync with Prisma
    } catch (error) {
      Alert.alert('Google login error', error as string);
    }
  };


  return (
    <View style={styles.container}>
      <Toast position="bottom" bottomOffset={30} visibilityTime={2000} />
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
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => handleLogin()}
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
        <TouchableOpacity style={styles.googleButton} 
        onPress={() => handleGoogleSignIn()}
         disabled={isLoading}>
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
    borderColor: "#999999",
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
    borderColor: "#999999",
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
    borderColor: "#999999",
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
});
