import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../firebase";
import { trpcReact } from "../../../trpc";

interface GoogleSignInType {
  setIsLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
  registerUserMutation: ReturnType<typeof trpcReact.user.registerUser.useMutation>;
}

export const handleGoogleSignIn = async ({
  setIsLoading,
  setToken,
  registerUserMutation,
}: GoogleSignInType) => {
  const provider = new GoogleAuthProvider();
  setIsLoading(true);
  try {
    const response = await signInWithPopup(auth, provider);

    console.log("User", response.user);
    const { uid, displayName, photoURL, email } = response.user;

    if (!uid || !displayName || !photoURL || !email) {
      toast.error("All the required parameters are missing");
      throw new Error("All the required parameters are missing");
    }

    const credential = GoogleAuthProvider.credentialFromResult(response);
    console.log("AccessToken", credential?.accessToken);

    const token = await response.user.getIdToken();
    setToken(token);

    console.log('sending this', {email, uid, photoURL, displayName})

    registerUserMutation.mutate({
      email,
      id: uid,
      image: photoURL,
      name: displayName,
    });
  } catch (error: any) {
    let errorMessage = "An error occurred during Google login";
    console.log(error)

    if (error.code) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Google Sign-In was cancelled";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "Google Sign-In was cancelled";
          break;
        case "auth/popup-blocked":
          errorMessage = "Google Sign-In was blocked";
          break;
      }
    }
    toast.error("Error signing", {
      description: errorMessage,
    });
  } finally {
    setIsLoading(false);
  }
};
