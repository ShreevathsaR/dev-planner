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
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";

const { width } = Dimensions.get("window");

export default function Project() {
  const { projectId } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "75%", "100%"], []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom sheet index:", index);
    setIsSheetOpen(index !== -1);
  }, []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
    setIsSheetOpen(true);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setIsSheetOpen(false);
  };

  const project = useProjectsStore((state) =>
    state.projects.find((project) => project.id === projectId)
  );
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm from ${project?.name}, your AI assistant. How can I help you today?`,
      isUser: false,
    },
  ]);
  const navigation = useNavigation();
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now(), text: inputText.trim(), isUser: true };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Scroll to bottom after adding user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I understand your message. This is a simulated AI response that would typically be generated based on your input.",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Scroll to bottom after AI response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
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
              <TouchableOpacity
                onPress={openBottomSheet}
                style={{ marginRight: 16 }}
              >
                <Icon name="info" size={24} color="white" />
              </TouchableOpacity>
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
                  message.isUser
                    ? styles.userMessageWrapper
                    : styles.aiMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser
                        ? styles.userMessageText
                        : styles.aiMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
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
                placeholder="Ask Grok anything..."
                placeholderTextColor="#666666"
                style={styles.input}
                multiline
                maxLength={2000}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
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
            </View>
          </View>
        </KeyboardAvoidingView>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1} // Start closed
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
          animateOnMount={true}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Project Details</Text>
              <Pressable onPress={closeBottomSheet} style={styles.closeButton}>
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
              />
            </View>

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

            <Pressable onPress={closeBottomSheet} style={styles.backButton}>
              <Text style={styles.backButtonText}>Close Details</Text>
            </Pressable>
          </BottomSheetView>
        </BottomSheet>
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
