import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const teamSizeOptions = [
  { label: "1–10", value: 10 },
  { label: "10–50", value: 50 },
  { label: "50–100", value: 100 },
  { label: "100–200", value: 200 },
  { label: "200+", value: 500 },
];

export const skillOptions = [
  { label: "React", value: "React" },
  { label: "Node.js", value: "Node.js" },
  { label: "PostgreSQL", value: "PostgreSQL" },
  { label: "TypeScript", value: "TypeScript" },
  { label: "JavaScript", value: "JavaScript" },
  { label: "Python", value: "Python" },
  { label: "Java", value: "Java" },
  { label: "Go", value: "Go" },
  { label: "Ruby", value: "Ruby" },
  { label: "PHP", value: "PHP" },
  { label: "MySQL", value: "MySQL" },
  { label: "MongoDB", value: "MongoDB" },
  { label: "Redis", value: "Redis" },
  { label: "GraphQL", value: "GraphQL" },
  { label: "REST API", value: "REST API" },
  { label: "Docker", value: "Docker" },
  { label: "Kubernetes", value: "Kubernetes" },
  { label: "AWS", value: "AWS" },
  { label: "Azure", value: "Azure" },
  { label: "GCP", value: "GCP" },
  { label: "Next.js", value: "Next.js" },
  { label: "Express.js", value: "Express.js" },
  { label: "Django", value: "Django" },
  { label: "Flask", value: "Flask" },
  { label: "React Native", value: "React Native" },
  { label: "Vue.js", value: "Vue.js" },
  { label: "Angular", value: "Angular" },
  { label: "SQL", value: "SQL" },
  { label: "Prisma", value: "Prisma" },
  { label: "TailwindCSS", value: "TailwindCSS" },
];
