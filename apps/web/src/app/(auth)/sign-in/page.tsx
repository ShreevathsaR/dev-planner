"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema, SignInFormType } from "../../../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setSession } from "@/lib/setSession";
import { trpcReact } from "../../../../trpc";
import { handleGoogleSignIn } from "@/lib/services/googleSignIn";
import { useUserStore } from "@/lib/context/userStore";

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  const setUser = useUserStore((state) => state.setUser);

  const registerUserMutation = trpcReact.user.registerUser.useMutation({
    onSuccess: async () => {
      await setSession(token);
      setUser(auth.currentUser);
      router.replace("/home");
      setIsLoading(false);
      return toast.success("Logged-in successfully");
    },
    onError: async (error) => {
      console.log(error);
      console.log(error.data);
      if (error.data?.code === "CONFLICT") {
        await setSession(token);
        setUser(auth.currentUser);
        router.replace("/home");
        setIsLoading(false);
        return toast.success("Logged-in successfully");
      }
      setIsLoading(false);
      return toast.error("Failed storing user", {
        description: error.message,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<SignInFormType>) {
    const { email, password } = data;
    setIsLoading(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      console.log(response);

      if (!response.user) {
        return toast.error("Login failed", {
          description: "Login failed please try again",
        });
      }

      if (!response.user.emailVerified) {
        await sendEmailVerification(response.user);
        return toast.error("Your email is not verified", {
          description: "Please check your email for verification",
        });
      }

      const token = await response.user.getIdToken();
      await setSession(token);

      router.replace("home");
      return toast.success("User logged-in successfully");
    } catch (error: any) {
      let errorMessage = error.code;

      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found";
          break;
        case "auth/wrong-password":
          errorMessage = "Wrong password";
          break;
      }

      toast.error("Error signing up", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full bg-background flex-col min-h-screen justify-center gap-6">
      <Card className="w-100 self-center bg-secondary-background border-white/20 border-1">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white/80">Welcome</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            disabled={isLoading}
            onClick={() =>
              handleGoogleSignIn({
                registerUserMutation,
                setIsLoading,
                setToken,
              })
            }
            variant="outline"
            className="w-full mb-5 text-white/90 bg-black border-white/15 hover:bg-white/15 hover:cursor-pointer hover:text-accent-foreground"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
            )}
            {isLoading ? "Please wait..." : "Login with Google"}
          </Button>
          <div className="after:border-white/20 mb-5 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-accent-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-white/15 text-accent-foreground focus:!border-white/35 focus:border"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-accent-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-white/15 text-accent-foreground focus:!border-white/35 focus:border"
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                type="submit"
                className="w-30 self-center bg-foreground hover:bg-accent hover:text-white text-black hover:cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-background *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Not registered with us? Please{" "}
        <a href="/sign-up" className="hover:!text-accent-foreground">
          Sign up
        </a>
        .
      </div>
    </div>
  );
}
