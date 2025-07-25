import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import * as z from "zod";
import { useUserStore } from "@/lib/context/userStore";
import { skillOptions, teamSizeOptions } from "@/lib/utils";
import { MultiSelect } from "./ui/MultiSelect";
import { trpcReact } from "trpc";
import { toast } from "sonner";
import { useProjectStore } from "@/lib/context/projectStore";

const CreateProjectModal = () => {
  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const setSelectedProject = useProjectStore(
    (state) => state.setSelectedProject
  );

  const utils = trpcReact.useUtils();

  const createProject = trpcReact.projectsRouter.createProject.useMutation({
    onSuccess: async ({data}: {data: any}) => {
      toast.success("Project created successfully");
      setOpen(false);
      setSelectedProject(data.data);
      utils.projectsRouter.getProjects.invalidate();
    },
    onError: () => {
      toast.error("Error creating project");
    },
  });

  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      createdBy: user?.uid,
      name: "",
      description: "",
      details: {
        budget: "medium",
        teamSize: 10,
        skills: [],
        timeline: "",
      },
    },
  });

  const onSubmit = (data: z.infer<typeof createProjectSchema>) => {
    createProject.mutate({
      ...data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-accent bg-background max-h-[80vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new project. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter project description"
                        className="min-h-[100px] max-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details.teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      defaultValue={field.value?.toString()} // convert number -> string for Select
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black text-white">
                        {teamSizeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()} // Select accepts string only
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <FormField
                control={form.control}
                name="details.skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={skillOptions}
                        selected={field.value || []}
                        onChange={(val) =>
                          field.onChange(val.length > 0 ? val : undefined)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Select all required technologies for the project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Budget */}
              <FormField
                control={form.control}
                name="details.budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black text-white">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timeline */}
              <FormField
                control={form.control}
                name="details.timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter project timeline (e.g., 3 months, Q2 2024)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="text-black"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
