"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SidebarComponent from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";
import { getProjects } from "@/lib/services/getProjects";
import { useEffect } from "react";
import { useProjectStore } from "@/lib/context/projectStore";
import { useUserStore } from "@/lib/context/userStore";
import DetailsSection from "@/components/DetailsSection";
import CreateProjectModal from "@/components/createProject";
import { trpcReact } from "trpc";

const Page = () => {
  const user = useUserStore((state) => state.user);
  const { data: projectsData, isFetching } =
    trpcReact.projectsRouter.getProjects.useQuery(undefined, {
      enabled: !!user,
      staleTime: 0
    });
  const setProjects = useProjectStore((state) => state.setProjects);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );
  const selectedProject = useProjectStore((state) => state.selectedProject);

  console.log(selectedProject);

  useEffect(() => {
    if (projectsData) {
      console.log(projectsData.data);
      if (projectsData.data.length > 0) {
        setProjects(projectsData.data);
        if (!selectedProject || selectedProject == null) {
          setSelectedProject(projectsData.data[0]);
        }
        console.log(selectedProject);
        return;
      } else {
        setProjects([]);
      }
    }
  },[projectsData, user]);

  if (isFetching) {
    return (
      <div className="flex w-full items-center justify-center">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background w-full">
      <SidebarComponent />
      <SidebarTrigger className=" bg-white/10" />
      {projectsData && projectsData?.data.length > 0 ? (
        <div className="flex w-screen">
          <ChatInterface />
          <DetailsSection />
        </div>
      ) : (
        <div className="flex w-full min-h-screen flex-col items-center justify-center gap-4">
          <h2 className="text-2xl gap-2 flex">
            Welcome {user?.displayName}
            <span role="img" aria-label="hi" className="mr-2">
              👋
            </span>
          </h2>
          <CreateProjectModal />
        </div>
      )}
    </div>
  );
};

export default Page;
