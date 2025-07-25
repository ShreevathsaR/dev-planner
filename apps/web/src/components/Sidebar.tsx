import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import {
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { deleteCookie } from "@/lib/setSession";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/context/userStore";
import Image from "next/image";
import { useProjectStore } from "@/lib/context/projectStore";
import { Project } from "@/lib/types";
import CreateProjectModal from "./createProject";

const SidebarComponent = () => {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const projects = useProjectStore((state) => state.projects);
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );
  const resetStore = useProjectStore(state => state.resetStore)
  // console.log("Current User:", user);
  console.log("Projects", projects);

  const router = useRouter();

  const handleSignOut = async () => {
    router.push("/sign-out");
  };

  const handleSelectProject = (project: Project) => {
    if (selectedProject?.id === project.id) {
      return;
    }
    setSelectedProject(project);
  };

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects && projects?.length > 0 ? (
                  projects?.map((project) => (
                    <SidebarMenuItem key={project.id} className="rounded">
                      <SidebarMenuButton
                        onClick={() => handleSelectProject(project)}
                        className={
                          selectedProject?.id == project.id
                            ? "p-6 bg-white/5 rounded hover:bg-white/5"
                            : "p-6 rounded hover:bg-white/5"
                        }
                        asChild
                      >
                        <a href="#">
                          <span>{project.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <p className="p-10 text-center">
                    No Projects found please create one
                  </p>
                )}
              </SidebarMenu>
              <div className="flex justify-center items-center mt-5">
                <CreateProjectModal />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="bg-background flex justify-between items-center p-4">
          <div className="flex items-center justify-center gap-3">
            <Image
              src={
                user?.photoURL ||
                "https://api.dicebear.com/9.x/initials/svg?seed=John"
              }
              alt="profile"
              className="rounded-3xl"
              width={30}
              height={30}
            />
            <p>{user?.displayName}</p>
          </div>
          <Button onClick={() => handleSignOut()}>
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </Sidebar>
    </>
  );
};

export default SidebarComponent;
