import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { projects } from "@/lib/sample";

const { width } = Dimensions.get("window");

export default function Project() {
  const { projectId } = useLocalSearchParams();

    const project = projects.find((p) => p.id === projectId);

    const [messages, setMessages] = useState([
      {
        id: 1,
        text: `Hello! I'm ${project?.name}, your AI assistant. How can I help you today?`,
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
        <Stack.Screen options={{ headerShown: true, headerTitle: `${project?.name}`, headerTitleAlign:"center", headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/project/projectDetails?projectId=${projectId}`);
            }}
            style={{ marginRight: 16 }}
          >
            <Icon name="info" size={24} color="white" />
          </TouchableOpacity>
        )}} />
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
});
