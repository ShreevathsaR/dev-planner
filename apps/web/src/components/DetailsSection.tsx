"use client";
import { useProjectStore } from "@/lib/context/projectStore";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import ContextCard from "./ContextCard";
import DecisionsCard from "./DecisionsCard";

const DetailsSection = () => {
  const [isDecisionsExpanded, setIsDecisionsExpanded] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);


  return (
    <div className="flex flex-col gap-5 p-3 min-h-screen w-[25%] text-white">
      <ContextCard {...{isContextExpanded, setIsContextExpanded, setIsDecisionsExpanded, isDecisionsExpanded}}/>
      <DecisionsCard {...{isDecisionsExpanded, setIsDecisionsExpanded, isContextExpanded, setIsContextExpanded}}/>
    </div>
  );
};

export default DetailsSection;
