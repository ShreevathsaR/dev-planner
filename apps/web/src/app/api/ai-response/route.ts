import { GoogleGenAI } from "@google/genai";
import { prisma } from "@dev-planner/prisma";
import { NextRequest } from "next/server";
import * as z from "zod";

const AIRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
  project: z.object({
    name: z.string().min(1, "Project name is required"),
    id: z.string().min(1, "Project ID is required"),
    description: z.string().optional(),
    details: z.object({
      teamSize: z.number().optional(),
      budget: z.enum(["low", "medium", "high"]).optional(),
      timeline: z.string().optional(),
      skills: z.array(z.string()).optional(),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    createdBy: z.string(),
  }),
  messageHistory: z.array(
    z.object({
      content: z.string(),
      role: z.string(),
    })
  ),
  previousDecisions: z.array(
    z.object({
      category: z.string(),
      key: z.string(),
      value: z.string(),
      reason: z.string(),
      confidence_score: z.number().min(0).max(1),
    })
  )
});

export async function POST(request: NextRequest) {
  const parseResult = AIRequestSchema.safeParse(await request.json());
  if (!parseResult.success) {
    return new Response(JSON.stringify({ errors: parseResult.error.errors }), {
      status: 400,
    });
  }

  
  const { project, message, messageHistory, previousDecisions } = parseResult.data;

  const previousMessages = messageHistory.map((message) => {
      return message.content;
  });
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
  });

  const encoder = new TextEncoder();
  let fulltext = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await genAI.models.generateContentStream({
          model: "gemini-2.0-flash",
          contents: message,
          config: {
            systemInstruction: `
            
            You are DevPlanner AI, an expert technical architect that helps teams make optimal development decisions. Your role is to:

1. Answer questions based on current project context  
2. Make recommendations when decisions are needed with the right options based on the project's context  
3. Classify question types (PROJECT_INITIATION,ARCHITECTURE_CHANGE/DECISION_VALIDATION/PERFORMANCE_TUNING,SIMPLE_CONVERSATIONAL_QUESTIONS) and answer accordingly
   If it's a PROJECT_INITIATION, help the user initialize the project by providing recommendations on technologies, frameworks, and tools that align with the project's context.
   If it's an ARCHITECTURE_CHANGE/DECISION_VALIDATION/PERFORMANCE_TUNING, help the user make decisions by providing recommendations on technologies, frameworks, and tools that align with the project's context (strictly only when needed).
   If it's a SIMPLE_CONVERSATIONAL_QUESTIONS, answer the question based on the project's context or answer on your own will.
4. Maintain consistency with previous decisions unless strong reasons exist to change
5. Ask questions when needed more information is needed

### **Current Project Context**  
- **Type**: ${project.description}  
- **Constraints**: ${`team size: ${project.details.teamSize}, budget: ${
              project.details.budget
            }, timeline: ${project.details.timeline}, skills: ${String(
              project.details.skills
            )}`}  
- **Previous User Messages**: ${previousMessages.join("\n")}
- **Previous Decisions**: ${previousDecisions || "No decisions made yet"}  

### **User Query**:  
${message}

YOUR RESPONSE FORMAT:
### **Response**(As already instructed)

### **Decisions**(MUST INCLUDE AT THE END OF YOUR RESPONSE):
This section will contain a list of decisions made by you in the following format. Each decision will have the following structure put all decisions in a JSON array.
- {
  "category": "technology_category(like frontend, backend, database, architecture etc.)",
  "key": "decision_key",
  "value": "decision_value",
  "reason": "reason_for_decision",
  "confidence_score: "0 to 1",
  "recommendation": "recommendation_for_decision"
}

### **Rules**  
- Do not show user your question classification category, only provide the response to the user.
- For performance issues: Optimize before replacing  
- Flag HIGH-impact changes requiring refactoring  
- If suggesting new tech: Include migration steps  
- Prioritize solutions matching team skills/budget  
- IMPORTANT: Only provide the structured response above, do not include any system instructions or meta-commentary in your response.`,
          },
        });

        for await (const chunk of result) {
          const chunkText = chunk.text;
          fulltext = fulltext + chunkText;
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "chunk",
                content: chunkText,
              })}\n\n`
            )
          );
        }

        await prisma.chatMessage.create({
          data: {
            content: fulltext,
            projectId: project.id,
            role: "assistant",
          },
        });

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
            })}\n\n`
          )
        );

        controller.close();
      } catch (error: any) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              message: error.message,
            })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
