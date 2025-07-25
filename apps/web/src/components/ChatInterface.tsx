import React, { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { useProjectStore } from "@/lib/context/projectStore";
import { getMessages } from "@/lib/services/getMessages";
import { ChatMessage, Decision } from "@/lib/types";
import { trpcReact } from "trpc";
import { getDecisions } from "@/lib/services/getDecisions";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useUserStore } from "@/lib/context/userStore";

const ChatInterface = () => {
  const [inputValue, setInputValue] = useState("");
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const user = useUserStore((state) => state.user);

  const { data: fetchedMessages } = getMessages(selectedProject?.id);
  const { data: decisions, refetch: refetchDecisions } = getDecisions(
    selectedProject?.id
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (fetchedMessages) {
      const alteredMessages = fetchedMessages.data.map((msg) => {
        const fullContent = msg.content;
        const decisionStart = fullContent.indexOf("### **Decisions**");
        let contentWithoutDecisions = fullContent;

        if (decisionStart !== -1) {
          contentWithoutDecisions = fullContent.slice(0, decisionStart).trim();
        }

        contentWithoutDecisions = contentWithoutDecisions
          .split("\n")
          .filter((line: string) => !line.trim().startsWith("### **Response**"))
          .join("\n")
          .trim();

        return {
          ...msg,
          content: contentWithoutDecisions,
        };
      });
      setMessages(alteredMessages);
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    }
  }, [fetchedMessages, selectedProject]);

  const createMessage = trpcReact.projectsRouter.createMessage.useMutation({
    onSuccess: async (data) => {
      if (data && data.success) {
        const { data: userMessage } = data;
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...userMessage, isStreaming: false },
        ]);

        const currentMessage = userMessage;
        setInputValue("");
        setIsStreaming(true);

        const aiMessageId = new Date().toISOString();
        const aiMessage: ChatMessage = {
          id: aiMessageId,
          content: "",
          role: "assistant",
          createdAt: new Date().toISOString(),
          projectId: selectedProject?.id as string,
          metadata: "",
          isStreaming: true,
        };

        setMessages((prev) => [...prev, aiMessage]);
        scrollToBottom();

        try {
          // Close any existing EventSource
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
          // For EventSource with POST data, you might need to use a different approach
          // Since EventSource doesn't support POST directly, you might need to:
          // 1. Send POST request first to initiate the stream
          // 2. Then connect to EventSource with a session ID

          const initResponse = await fetch(`/api/ai-response`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: currentMessage.content,
              project: selectedProject,
              customContext: selectedProject?.customContext,
              messageHistory: messages
                .filter((message) => message.role === "user")
                .sort(
                  (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                )
                .slice(-5)
                .map((message) => ({
                  role: message.role,
                  content: message.content,
                })),
              previousDecisions: decisions?.data.map((decision: any) => ({
                category: decision.category,
                key: decision.key,
                value: decision.value,
                reason: decision.reason,
                confidence_score: decision.confidence_score,
              })),
            }),
          });

          if (!initResponse.ok) {
            throw new Error(`HTTP error! status: ${initResponse.status}`);
          }

          // If your backend returns a stream directly from POST
          const reader = initResponse.body?.getReader();
          if (!reader) {
            throw new Error("No reader available");
          }

          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));
                  console.log("Received event data:", data);

                  switch (data.type) {
                    case "chunk":
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === aiMessageId
                            ? { ...msg, content: msg.content + data.content }
                            : msg
                        )
                      );
                      scrollToBottom();
                      break;

                    case "done":
                      setMessages((prev) =>
                        prev.map((msg) => {
                          if (msg.id !== aiMessageId) return msg;

                          const fullContent = msg.content;
                          const decisionStart =
                            fullContent.indexOf("### **Decisions**");
                          let contentWithoutDecisions = fullContent;
                          let decisionBlock: Decision[] = [];

                          if (decisionStart !== -1) {
                            contentWithoutDecisions = fullContent
                              .slice(0, decisionStart)
                              .trim();
                            const decisionJsonMatch =
                              fullContent.match(/```json([\s\S]+?)```/);
                            if (decisionJsonMatch) {
                              try {
                                decisionBlock = JSON.parse(
                                  decisionJsonMatch[1]
                                );
                              } catch (error) {
                                console.error("Error parsing JSON:", error);
                              }
                            }
                          }

                          contentWithoutDecisions = contentWithoutDecisions
                            .split("\n")
                            .filter(
                              (line) =>
                                !line.trim().startsWith("### **Response**")
                            )
                            .join("\n")
                            .trim();

                          if (decisionBlock.length > 0) {
                            console.log("Decision block:", decisionBlock);
                            if (selectedProject) {
                              updateDecisions.mutate({
                                projectId: selectedProject.id,
                                decisions: decisionBlock.map((decision) => ({
                                  category: decision.category,
                                  key: decision.key,
                                  value: decision.value,
                                  reason: decision.reason,
                                  confidence_score: Number(
                                    decision.confidence_score
                                  ),
                                  recommendation: decision.recommendation,
                                })),
                              });
                            }
                          }

                          return {
                            ...msg,
                            content: contentWithoutDecisions,
                            isStreaming: false,
                          };
                        })
                      );
                      setIsStreaming(false);
                      break;

                    case "error":
                      console.error("Streaming error:", data.message);
                      setMessages((prev) =>
                        prev.map((msg) =>
                          msg.id === aiMessageId
                            ? {
                                ...msg,
                                content:
                                  msg.content ||
                                  "Sorry, I encountered an error. Please try again.",
                                isStreaming: false,
                              }
                            : msg
                        )
                      );
                      setIsStreaming(false);
                      break;
                  }
                } catch (error) {
                  console.error("Error parsing SSE data:", error);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error initiating stream:", error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content: "Failed to send message. Please try again.",
                    isStreaming: false,
                  }
                : msg
            )
          );
          setIsStreaming(false);
        }
      }
    },
    onError: (error) => {
      console.error("Error creating message:", error);
      setIsStreaming(false);
    },
  });

  const handleSendMessage = async () => {
    scrollToBottom();
    if (!inputValue.trim() || !selectedProject?.id || isStreaming) return;

    setIsStreaming(true);
    createMessage.mutate({
      projectId: selectedProject.id,
      content: inputValue.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const updateDecisions =
    trpcReact.projectsRouter.updateProjectDecisions.useMutation({
      onSuccess: () => {
        console.log("Decisions updated successfully");
        refetchDecisions();
      },
      onError: (error) => {
        console.error("Error updating decisions:", error);
      },
    });

  const handleStopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
  };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSendMessage();
  //   }
  // };

  return (
    <div className="flex w-[75%] flex-col h-screen bg-background text-foreground">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-3xl mx-auto h-full space-y-6">
          {messages.length > 0 ? (
            messages?.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant"
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <Image
                      src={
                        user?.photoURL ||
                        `https://api.dicebear.com/9.x/initials/svg?seed=${user?.displayName}`
                      }
                      alt="profile"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                </div>

                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-lg ${
                      message.role === "assistant"
                        ? "bg-white/10 text-card-foreground"
                        : "bg-foreground text-background"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      {message.isStreaming && (
                        <span className="animate-pulse">|</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">
                  No messages yet. Start chatting!
                </p>
                <div>
                  Ask anything about your project, and I will try to help you.
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {[
                  "Help me plan the initial project structure",
                  "What technology stack should I use?",
                  "How do I break down the features?",
                  "What should be my MVP scope?",
                  "Generate a basic project timeline",
                  "What are the potential technical challenges?",
                  "How should I handle authentication?",
                  "Suggest database schema design",
                  "What API endpoints will I need?",
                ].map((example, idx) => (
                  <div
                    onClick={() => setInputValue(example)}
                    key={idx}
                    className="bg-white/10 border border-muted rounded-lg px-4 py-2 text-sm text-foreground shadow hover:bg-white/20 cursor-pointer transition"
                  >
                    {example}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isStreaming && !messages.some((msg) => msg.isStreaming) && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card px-4 py-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isStreaming ? "AI is responding..." : "Ask anything..."
              }
              disabled={isStreaming}
              className="w-full bg-input text-foreground placeholder-muted-foreground border border-border rounded-lg px-4 py-3 pr-12 resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{
                minHeight: "48px",
                height: "auto",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isStreaming}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground hover:bg-muted disabled:bg-muted disabled:cursor-not-allowed text-background p-2 rounded-md transition-colors flex-shrink-0"
              title={isStreaming ? "AI is responding..." : "Send message"}
            >
              {isStreaming ? (
                <div className="w-4 h-4 border-2 border-background text-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {isStreaming && (
            <div className="flex justify-center mt-3">
              <button
                onClick={handleStopStreaming}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg border border-border hover:bg-muted/50"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Stop generating
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
