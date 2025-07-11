"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { deleteCookie } from "@/lib/setSession";
import { trpcClient } from "@dev-planner/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";

const page = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    console.log("Signing out");
    await signOut(auth);
    await deleteCookie();
    router.push("/sign-in");
  };

  const [trpcclient] = useState(trpcClient.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/trpc",
      }),
    ],
  }));


  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-black text-white">
      <h3 className="text-4xl font-bold">Dashboard</h3>
      <Button
        style={{
          backgroundColor: "white",
          color: "black",
        }}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default page;
