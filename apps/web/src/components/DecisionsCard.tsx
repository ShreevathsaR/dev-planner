import { useProjectStore } from "@/lib/context/projectStore";
import { getDecisions } from "@/lib/services/getDecisions";
import { ChevronDown, ChevronUp, Trash } from "lucide-react";
import React, { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { deleteDecision } from "@/lib/services/deleteDecision";

const DecisionsCard = ({
  isDecisionsExpanded,
  setIsDecisionsExpanded,
  isContextExpanded,
  setIsContextExpanded,
}: {
  isContextExpanded: boolean;
  setIsContextExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isDecisionsExpanded: boolean;
  setIsDecisionsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const selectedProject = useProjectStore((state) => state.selectedProject);

  const [showReason, setShowReason] = useState<{ [key: string]: boolean }>({});

  const { data: decisions, isFetching, refetch: decisionsRefetch} = getDecisions(selectedProject?.id);
  const deleteDecisionMutation = deleteDecision(decisionsRefetch);

  const toggleExpand = (id: string) => {
    setShowReason((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isFetching) {
    return (
      <div className="bg-card border-accent border p-4 rounded-xl">
        {" "}
        <div className="space-y-2">
          <Skeleton className="h-4 bg-white/30 w-[250px]" />
          <Skeleton className="h-4 bg-white/30 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-accent border p-4 rounded-xl">
      <div className="flex w-full gap-5">
        <div className="p-2 flex flex-col w-[90%]">
          <p className="text-lg mb-2">Decisions</p>
          <p className="text-xs text-gray-400">All your decisions are here</p>
        </div>
        {!isDecisionsExpanded ? (
          <ChevronDown
            className="hover:cursor-pointer"
            size={24}
            onClick={() => {
              if (isContextExpanded) {
                setIsContextExpanded(false);
              }
              setIsDecisionsExpanded(true);
            }}
          />
        ) : (
          <ChevronUp
            className="hover:cursor-pointer"
            size={24}
            onClick={() => setIsDecisionsExpanded(false)}
          />
        )}
      </div>
      {isDecisionsExpanded && (
        <div
          style={{ scrollbarWidth: "none" }}
          className="max-h-100 relative overflow-y-auto"
        >
          {decisions?.data && decisions.data.length > 0 ? (
            <div className="flex-col flex gap-1 justify-between">
              {decisions.data.map((decision) => {
                return (
                  <div key={decision.id}>
                    <div className="flex items-center gap-1">
                      <div className="bg-white/5 w-[90%] p-2 rounded flex justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm">
                            {(
                              decision.value.charAt(0).toUpperCase() +
                              decision.value.slice(1)
                            ).replaceAll("_", " ")}
                          </p>
                          <p className="text-xs text-white/40">
                            {(
                              decision.key.charAt(0).toUpperCase() +
                              decision.key.slice(1)
                            ).replaceAll("_", " ")}
                          </p>
                        </div>
                        <div>
                          {!showReason[decision.id] ? (
                            <ChevronDown
                              className="hover:cursor-pointer"
                              onClick={() => toggleExpand(decision.id)}
                            />
                          ) : (
                            <ChevronUp
                              className="hover:cursor-pointer"
                              onClick={() => toggleExpand(decision.id)}
                            />
                          )}
                        </div>
                      </div>
                      <Trash
                        onClick={() =>
                          deleteDecisionMutation.mutate(decision.id)
                        }
                        size={28}
                        color="white"
                        className="hover:cursor-pointer bg-red-500 p-1 rounded-lg"
                      />
                    </div>
                    {showReason[decision.id] && (
                      <div className="text-[10px] w-[90%] text-white/70 font-extralight bg-white/5 p-3">
                        {decision.reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center p-5">No decisions</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionsCard;
