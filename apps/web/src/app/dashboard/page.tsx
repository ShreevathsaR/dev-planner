"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const signOut = async () => {
    const response = await authClient.signOut();
    if (response.data?.success) {
      router.push("/sign-in");
    }
  };

  return (
    <div>
      Dashboard
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default page;
