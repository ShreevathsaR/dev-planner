import { useProjectStore } from "@/lib/context/projectStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { trpcReact } from "../../trpc/client";
import { Button } from "./ui/button";

const ContextCard = ({
  isContextExpanded,
  setIsContextExpanded,
  isDecisionsExpanded,
  setIsDecisionsExpanded,
}: {
  isContextExpanded: boolean;
  setIsContextExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isDecisionsExpanded: boolean;
  setIsDecisionsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );
  const [customContext, setCustomContext] = useState(
    selectedProject?.customContext || ""
  );
  const utils = trpcReact.useUtils();

  const updateProjectData = trpcReact.projectsRouter.updateProject.useMutation({
    onSuccess: async ({ data }: { data: any }) => {
      toast.success("Project context updated sucessfully");
      setSelectedProject(data);
      await utils.projectsRouter.getProjects.invalidate();
    },
    onError: () => {
      toast.error("Error updating context");
    },
  });

  const updateProject = async () => {
    updateProjectData.mutate({
      createdBy: selectedProject?.createdBy || "",
      id: selectedProject?.id || "",
      name: selectedProject?.name || "",
      description: selectedProject?.description || "",
      details: selectedProject?.details || undefined,
      customContext: customContext.trim(),
    });
  };

  return (
    <div className="bg-card border-accent border p-4 rounded-xl">
      <div className="flex w-full gap-5">
        <div className="p-2 flex flex-col w-[90%]">
          <p className="text-lg mb-2">Context</p>
          <p className="text-xs text-gray-400">
            {selectedProject?.description || "No description"}
          </p>
        </div>
        {!isContextExpanded ? (
          <ChevronDown
            className="hover:cursor-pointer"
            size={24}
            onClick={() => {
              if (isDecisionsExpanded) {
                console.log("yes");
                setIsDecisionsExpanded(false);
              }
              setIsContextExpanded(true);
            }}
          />
        ) : (
          <ChevronUp
            className="hover:cursor-pointer"
            size={24}
            onClick={() => setIsContextExpanded(false)}
          />
        )}
      </div>
      {isContextExpanded && (
        <div
          style={{ scrollbarWidth: "none" }}
          className="max-h-100 relative overflow-y-auto"
        >
          <p className="mt-5 text-sm">Enter you context</p>
          <textarea
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="max-w-[100%] min-h-30 max-h-40 p-3 rounded bg-white/5 text-sm border border-accent mt-2 "
            onChange={(e) => setCustomContext(e.target.value)}
            value={customContext}
          />
          {customContext !== selectedProject?.customContext && (
            <Button
              onClick={() => updateProject()}
              className="bg-foreground/90 hover:text-foreground hover:cursor-pointer text-black"
            >
              Update
            </Button>
          )}
          <p className="mt-3 text-sm">Details</p>
          <ul className="bg-white/5 rounded flex flex-col gap-3 p-2 border border-accent mt-2">
            <li className="flex justify-between">
              <p>Budget</p>
              <p>{selectedProject?.details?.budget}</p>
            </li>
            <li className="flex justify-between">
              <p>Team Size</p>
              <p>{selectedProject?.details?.teamSize}</p>
            </li>
            <li className="flex justify-between">
              <p>Timeline</p>
              <p>{selectedProject?.details?.timeline}</p>
            </li>
            <li className="flex flex-col justify-between">
              <p>Skills</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedProject?.details?.skills?.map((skill, index) => {
                  return (
                    <p
                      className="bg-black p-2 rounded-xl text-xs border border-accent-foreground"
                      key={index}
                    >
                      {skill}
                    </p>
                  );
                })}
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContextCard;
