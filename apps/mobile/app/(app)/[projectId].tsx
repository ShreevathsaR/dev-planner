import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useProjectsStore } from "@/lib/context/userStore";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import EventSource from "react-native-sse";
import { ChatMessage, Decision, DecisionType } from "@/lib/types";
import { trpcReact } from "../../trpc";
import { useProjectMessages } from "@/hooks/useProjectMessages";
import DecisionsSheet from "@/components/DecisionsSheet";

const { width } = Dimensions.get("window");

const SERVER_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function Project() {
  const { projectId } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const decisionsBottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "75%", "100%"], []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDecisionSheetOpen, setIsDecisionSheetOpen] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const selectedProject = useProjectsStore((state) => state.selectedProject);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const { data: fetchedMessages } = useProjectMessages(projectId);

  const {
    data: decisionsData,
    error: decisionsError,
    isFetching: isDecisionsFetching,
    refetch: decisionRefetch,
  } = trpcReact.projectsRouter.getDecisions.useQuery(
    {
      projectId: projectId as string,
    },
    {
      staleTime: 1000 * 60 * 1,
    }
  );

useEffect(() => {
  if (decisionsData) {
    setDecisions(decisionsData.data);
  }
}, [decisionsData]);

  const updateDecisions =
    trpcReact.projectsRouter.updateProjectDecisions.useMutation({
      onSuccess: (data) => {
        if (data && data.success) {
          console.log("Decisions updated successfully");
        } else {
          console.error("Failed to update decisions:", data);
        }
      },
      onError: (error) => {
        console.error("Error updating decisions:", error);
      },
    });

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
          .filter((line) => !line.trim().startsWith("### **Response**"))
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
      scrollToBottom();
    }
  }, [fetchedMessages, selectedProject]);

  // if (projectFetchingError) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "black",
  //       }}
  //     >
  //       <Text style={{ color: "white" }}>Error fetching project</Text>
  //     </View>
  //   );
  // }

  // if (isFetching) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "black",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color="white" />
  //       <Text style={{ color: "white" }}>Loading...</Text>
  //     </View>
  //   );
  // }

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom sheet index:", index);
    setIsSheetOpen(index !== -1);
  }, []);
  const handleDecisionSheetChanges = useCallback((index: number) => {
    console.log("Bottom sheet index:", index);
    setIsDecisionSheetOpen(index !== -1);
  }, []);

  const openBottomSheet = (type: "details" | "decisions") => {
    if (type === "decisions") {
      setIsSheetOpen(false);
      bottomSheetRef.current?.close();
      decisionsBottomSheetRef.current?.snapToIndex(2);
      setIsDecisionSheetOpen(true);
      return;
    }
    setIsDecisionSheetOpen(false);
    decisionsBottomSheetRef.current?.close();
    bottomSheetRef.current?.snapToIndex(1);
    setIsSheetOpen(true);
  };

  const closeBottomSheet = (type: "details" | "decisions") => {
    if (type === "decisions") {
      decisionsBottomSheetRef.current?.close();
      setIsDecisionSheetOpen(false);
      return;
    }
    bottomSheetRef.current?.close();
    setIsSheetOpen(false);
  };

  const project = useProjectsStore((state) =>
    state.projects.find((project) => project.id === projectId)
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [context, setContext] = useState<string>("");

  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const createMessage = trpcReact.projectsRouter.createMessage.useMutation({
    onSuccess: async (data) => {
      if (data && data.success) {
        const { data: userMessage } = data;
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        const currentMessage = userMessage;
        setInputText("");
        setIsStreaming(true);

        const aiMessageId = new Date().toISOString();
        const aiMessage = {
          id: aiMessageId,
          content: "",
          role: "assistant",
          createdAt: new Date().toISOString(),
          projectId: projectId as string,
          metadata: "",
          isStreaming: true,
        };

        setMessages((prev) => [...prev, aiMessage]);
        scrollToBottom();

        try {

          eventSourceRef.current = new EventSource(
            `${SERVER_URL}/api/ai-response`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: currentMessage.content,
                project,
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
                previousDecisions: decisions?.map((decision: Decision) => {
                  return {
                    category: decision.category,
                    key: decision.key,
                    value: decision.value,
                    reason: decision.reason,
                    confidence_score: decision.confidence_score,
                  };
                }),
              }),
            }
          );

          eventSourceRef.current.addEventListener("message", async (event) => {
            try {
              console.log("Received event data:", event.data);
              const data = JSON.parse(event.data as string);

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
                      let decisionBlock: DecisionType[] = [];

                      if (decisionStart !== -1) {
                        contentWithoutDecisions = fullContent
                          .slice(0, decisionStart)
                          .trim();
                        const decisionJsonMatch =
                          fullContent.match(/```json([\s\S]+?)```/);
                        if (decisionJsonMatch) {
                          try {
                            decisionBlock = JSON.parse(decisionJsonMatch[1]);
                          } catch (error) {
                            console.error("Error parsing JSON:", error);
                          }
                        }
                      }

                      contentWithoutDecisions = contentWithoutDecisions
                        .split("\n")
                        .filter(
                          (line) => !line.trim().startsWith("### **Response**")
                        )
                        .join("\n")
                        .trim();

                      if (decisionBlock.length > 0) {
                        console.log("Decision block:", decisionBlock);
                        if (project) {
                          updateDecisions.mutate({
                            projectId: project.id,
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
                  if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                  }
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
                  if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                  }
                  break;
              }
            } catch (error) {
              console.error("Error parsing SSE data:", error);
            }
          });

          eventSourceRef.current.addEventListener("error", (error) => {
            console.error("SSE connection error:", error);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content:
                        msg.content || "Connection error. Please try again.",
                      isStreaming: false,
                    }
                  : msg
              )
            );
            setIsStreaming(false);
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
              eventSourceRef.current = null;
            }
          });
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
    },
  });

  const handleSend = async () => {
    if (!inputText.trim() || isStreaming) return;
    setIsStreaming(true);
    createMessage.mutate({
      projectId: projectId as string,
      content: inputText.trim(),
    });
  };

  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);

    setMessages((prev) =>
      prev.map((msg) =>
        msg.isStreaming
          ? {
              ...msg,
              text: msg.content + "\n\n[Response stopped]",
              isStreaming: false,
            }
          : msg
      )
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: `${project?.name}`,
            headerTitleAlign: "left",
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  onPress={() => openBottomSheet("decisions")}
                  style={{ marginRight: 16 }}
                >
                  <Icon name="edit" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openBottomSheet("details")}
                  style={{ marginRight: 16 }}
                >
                  <Icon name="info" size={24} color="white" />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -20 : 75}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.messagesContainer,
              { paddingBottom: 20 },
            ]}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.role == "user"
                    ? styles.userMessageWrapper
                    : styles.aiMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.role == "user"
                      ? styles.userBubble
                      : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.role == "user"
                        ? styles.userMessageText
                        : styles.aiMessageText,
                    ]}
                  >
                    {message.content}
                  </Text>
                  {message.isStreaming && (
                    <View style={styles.streamingIndicator}>
                      <Text style={styles.streamingText}>●</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <View
            style={[
              styles.inputContainer,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything..."
                placeholderTextColor="#666666"
                style={styles.input}
                multiline
                maxLength={2000}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
                editable={!isStreaming}
              />
              {isStreaming ? (
                <TouchableOpacity
                  onPress={stopStreaming}
                  style={[styles.sendButton, styles.stopButton]}
                >
                  <Icon name="square" size={16} color="#FF3B30" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleSend}
                  style={[
                    styles.sendButton,
                    { opacity: inputText.trim() ? 1 : 0.5 },
                  ]}
                  disabled={!inputText.trim()}
                >
                  <Icon
                    name="send"
                    size={20}
                    color={inputText.trim() ? "#FFFFFF" : "#666666"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
          animateOnMount={true}
        >
          <BottomSheetScrollView style={styles.contentContainer}>
            <ScrollView>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Project Details</Text>
                <Pressable
                  onPress={() => closeBottomSheet("details")}
                  style={styles.closeButton}
                >
                  <Feather name="x" size={24} color="white" />
                </Pressable>
              </View>

              <Text style={styles.title}>{project?.name}</Text>
              <Text style={styles.description}>{project?.description}</Text>

              <View style={styles.detailsContent}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your own context"
                  placeholderTextColor="#666666"
                  value={project?.customContext || ''}
                  multiline
                />
              </View>
              {context && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "black",
                    borderColor: "#696969",
                    borderWidth: 1,
                    width: "50%",
                    padding: 10,
                    alignSelf: "center",
                    marginBottom: 20,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>Update</Text>
                </TouchableOpacity>
              )}
              {project?.details && (
                <View style={styles.detailsContent}>
                  <View style={styles.detailItem}>
                    <Text style={styles.sectionLabel}>Budget:</Text>
                    <Text style={styles.sectionValue}>
                      {project.details.budget?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.sectionLabel}>Team Size:</Text>
                    <Text style={styles.sectionValue}>
                      ~{project.details.teamSize} members
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.sectionLabel}>Timeline:</Text>
                    <Text style={styles.sectionValue}>
                      {project.details.timeline}
                    </Text>
                  </View>
                  <View style={styles.detailItemSkills}>
                    <Text style={styles.sectionLabel}>Skills</Text>
                    <View style={styles.skillsContainer}>
                      {project.details.skills?.map((skill, index) => (
                        <Text key={index} style={styles.skillTag}>
                          {skill}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              )}

              <Pressable
                onPress={() => closeBottomSheet("details")}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Close Details</Text>
              </Pressable>
            </ScrollView>
          </BottomSheetScrollView>
        </BottomSheet>
        {project && (
          <BottomSheet
            ref={decisionsBottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleDecisionSheetChanges}
            enablePanDownToClose
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            animateOnMount={true}
          >
            <DecisionsSheet
              {...{
                closeBottomSheet,
                decisions,
                setDecisions,
                isDecisionsFetching,
                decisionsError,
                projectName: project.name,
                projectId: project.id,
                decisionRefetch
              }}
            />
          </BottomSheet>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    flexGrow: 1,
  },
  sectionText: {
    fontSize: 16,
    color: "lightgray",
    marginBottom: 4,
  },
  messageWrapper: {
    marginBottom: 16,
    width: "100%",
  },
  userMessageWrapper: {
    alignItems: "flex-end",
  },
  aiMessageWrapper: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: width * 0.85,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    position: "relative",
  },
  userBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomRightRadius: 6,
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#1A1A1A",
    borderBottomLeftRadius: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#333333",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  userMessageText: {
    color: "#000000",
  },
  aiMessageText: {
    color: "#FFFFFF",
  },
  streamingIndicator: {
    position: "absolute",
    bottom: 8,
    right: 12,
  },
  streamingText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#222222",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#1A1A1A",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#333333",
    minHeight: 48,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 20,
    paddingVertical: 8,
    paddingRight: 8,
    maxHeight: 120,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  stopButton: {
    backgroundColor: "#FF3B30",
  },
  backButton: {
    alignSelf: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    minWidth: 120,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
  },
  detailsButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  detailsButtonDisabled: {
    backgroundColor: "#555555",
  },
  detailsButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  sheetBackground: {
    backgroundColor: "black",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "white",
    shadowRadius: 100,
  },
  handleIndicator: {
    backgroundColor: "#ccc",
    width: 60,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "medium",
    color: "lightgray",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "black",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  detailsContent: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "lightgray",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  detailItemSkills: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "lightgray",
    flex: 1,
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "lightgray",
    flex: 2,
    textAlign: "right",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  skillTag: {
    backgroundColor: "black",
    color: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: "#696969",
    borderWidth: 1,
    fontSize: 14,
    fontWeight: "500",
    overflow: "hidden",
  },
});
