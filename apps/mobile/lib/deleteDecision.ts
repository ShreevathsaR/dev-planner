import Toast from "react-native-toast-message";
import { trpcReact } from "../trpc/client";

export const deleteDecisionService = (projectId: string) => {
  const utils = trpcReact.useUtils();
  const deleteDecisionMutation = trpcReact.projectsRouter.deleteDecision.useMutation({
    onSuccess: () => {
      console.log("Decision deleted successfully");
      Toast.show({
        text1:"Decision deleted"
      });
      utils.projectsRouter.getDecisions.refetch({ projectId });
    },
    onError: () => {
      throw Error("Error deleting decision");
    },
  });
  return deleteDecisionMutation
};
