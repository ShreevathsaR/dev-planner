import { toast } from "sonner";
import { trpcReact } from "trpc"

export const deleteDecision = (decisionsRefetch: any) => {
    
    return trpcReact.projectsRouter.deleteDecision.useMutation({
        onSuccess: () => {
            console.log("Decision deleted successfully");
            toast.success("Decision deleted")
            decisionsRefetch()
        },
        onError: () => {
            throw Error("Error deleting decision")
        }
    })
}