"use client"
import { useProjectStore } from "@/lib/context/projectStore";
import { useUserStore } from "@/lib/context/userStore";
import { auth } from "@/lib/firebase";
import { deleteCookie } from "@/lib/setSession";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page = () => {
  const setUser = useUserStore((state) => state.setUser);
  const resetStore = useProjectStore((state) => state.resetStore);
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject)
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      console.log("Signing out");
      await deleteCookie();
      await signOut(auth);
      setUser(null);
      setSelectedProject(null)
      resetStore();
      router.push("/sign-in");
    };
    handleSignOut();
  });

  return <div className="bg-black"></div>;
};

export default page;
