import { auth } from "@/app/_layout";
import { trpcReact } from "@dev-planner/trpc";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import Toast from "react-native-toast-message";

interface GoogleSignInType {
  setIsLoading: (loading: boolean) => void;
  registerUserMutation: ReturnType<typeof trpcReact.user.registerUser.useMutation>;
}

export const handleGoogleSignIn = async ({setIsLoading, registerUserMutation}: GoogleSignInType) => {

    GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
  });

    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const { data } = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(data?.idToken);
      if (data) {
        const { user } = await signInWithCredential(auth, googleCredential);
        const { email, uid, displayName, photoURL } = user;
        
        if (!email || !uid || !displayName || !photoURL) {
          throw new Error("Required params are absent");
        }

        await registerUserMutation.mutate({
          name: displayName,
          email,
          id: uid,
          image: photoURL,
        });
      }
    } catch (error: any) {
      console.log(error);
      let errorMessage = "An error occurred during Google login";
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