import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { trpcReact } from "@/trpc";
import { Decision } from "@/lib/types";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface DecisionsSheetParams {
  closeBottomSheet: (type: "decisions" | "details") => void;
  decisions: Decision[];
  isDecisionsFetching: boolean;
  decisionsError: any | null;
  projectName: string;
  projectId: string;
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
  decisionRefetch: () => void;
}

export default function DecisionsSheet({
  closeBottomSheet,
  decisions,
  isDecisionsFetching,
  decisionsError,
  projectName,
  projectId,
  decisionRefetch,
  setDecisions,
}: DecisionsSheetParams) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const utils = trpcReact.useUtils();

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  utils.projectsRouter.getDecisions.refetch({ projectId });

  if (decisionsError) {
    return (
      <BottomSheetScrollView>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Decisions</Text>
          <Pressable
            onPress={() => closeBottomSheet("decisions")}
            style={styles.closeButton}
          >
            <Feather name="x" size={24} color="white" />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{decisionsError.message}</Text>
        </View>
      </BottomSheetScrollView>
    );
  }

  return (
    <BottomSheetScrollView style={styles.contentContainer}>
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Decisions</Text>
        <Pressable
          onPress={() => closeBottomSheet("decisions")}
          style={styles.closeButton}
        >
          <Feather name="x" size={24} color="white" />
        </Pressable>
      </View>
      <Text style={styles.title}>{projectName}</Text>
      <Text style={styles.description}>
        View the decisions made and make changes if needed
      </Text>
      <View style={styles.container}>
        {decisions?.map((decision) => {
          const isExpanded = expanded[decision.id];
          return (
            <View key={decision.id}>
              <TouchableOpacity
                onPress={() => toggleExpand(decision.id)}
                style={[
                  styles.decisionContainer,
                  isExpanded && styles.decisionContainerExpanded,
                ]}
              >
                <View>
                  <Text style={styles.decisionKey}>
                    {decision.key
                      .replace(/_/g, " ")
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </Text>
                  <Text style={styles.decisionValue}>{decision.value}</Text>
                </View>
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.decisionReason}>
                  <Text style={styles.reasonText}>
                    {decision.reason || "No reason provided"}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "500",
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
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 10,
    marginTop: 20,
    gap: 10,
    paddingBottom: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    lineHeight: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    zIndex: 100,
    height: "80%",
  },
  decisionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 7,
    minHeight: 60,
  },
  decisionContainerExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  decisionKey: {
    fontSize: 16,
    fontWeight: "500",
    color: "lightgray",
  },
  decisionValue: {
    fontSize: 14,
    color: "lightgray",
    marginTop: 2,
  },
  decisionReason: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  reasonText: {
    color: "#ccc",
    fontStyle: "italic",
    fontSize: 14,
  },
});
