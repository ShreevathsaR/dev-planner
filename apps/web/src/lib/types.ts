export interface Project {
  name: string;
  id: string;
  description: string | null;
  details: {
    budget?: "low" | "medium" | "high" | undefined;
    teamSize?: number | undefined;
    skills?: string[] | undefined;
    timeline?: string | undefined;
  } | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  customContext: string | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: string;
  projectId: string;
  createdAt: string;
  metadata: string | null;
  isStreaming: boolean;
}

export interface StreamChunk {
  type: "chunk" | "done" | "error";
  content?: string;
  message?: string;
}

export interface Decision {
  createdAt: string;
  category: string;
  key: string;
  value: string;
  reason: string;
  confidence_score: number;
  projectId: string;
  id: string;
  updatedAt: string;
  recommendation: string;
}
