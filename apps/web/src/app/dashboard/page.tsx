"use client";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { deleteCookie } from "@/lib/setSession";
import { trpcReact } from "@dev-planner/trpc/client";

const Page = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    console.log("Signing out");
    await signOut(auth);
    await deleteCookie();
    router.push("/sign-in");
  };

  const {data, error} = trpcReact.projectsRouter.getProjects.useQuery();

  console.log('projects test',data, error)

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

export default Page;
