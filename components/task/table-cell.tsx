/* eslint-disable @typescript-eslint/no-explicit-any */
import { useIsMobile } from "@/hooks/use-mobile";
import { projectSchema, taskSchema, userSchema } from "@/types/schemas";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { StatusEnum, PriorityEnum } from "@/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { priorityColorMap, statusColorMap } from "./task-data-table";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

export default function TableCellViewer({
  isNew = false,
  item,
  projectData,
  userData,
  create,
  update,
  onDelete,
}: {
  isNew: boolean;
  item: z.infer<typeof taskSchema>;
  projectData: z.infer<typeof projectSchema>[];
  userData: z.infer<typeof userSchema>[];
  create: (formData: FormData) => void;
  update: (formData: FormData) => void;
  onDelete: (id: string) => void;
}) {
  const isMobile = useIsMobile();

  async function handleSubmitUpdate(data: any) {
    // e.preventDefault();

    const formData = new FormData();
    formData.set("id", item._id);
    Object.keys(data).map((key) => formData.set(key, data[key]));

    try {
      if (isNew) {
        await create(formData);
      } else {
        await update(formData);
      }

      toast.success(isNew ? "Create task success!" : "Update task success!");
    } catch (err) {
      toast.error(
        (err as any).message ||
          (isNew ? "Create task failed!" : "Update task failed!")
      );
    }
  }
  async function handleDelete(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      await onDelete(item._id);
      toast.success("Delete task success!");
    } catch (err) {
      toast.error((err as any).message || "Delete task failed");
    }
  }

  const methods = useForm({
    defaultValues: item,
  });

  const { register } = methods;

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant={isNew ? "outline" : "link"}
          className={cn("w-fit ", !isNew && "px-0 text-foreground text-left")}
        >
          {isNew ? "Create a new task" : item.title}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmitUpdate)}
            className="flex flex-col h-full"
          >
            <DrawerHeader className="gap-1">
              <DrawerTitle>{item.title}</DrawerTitle>
              <DrawerDescription>Task detail</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm flex-1">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    {...register("title")}
                    id="title"
                    defaultValue={item.title}
                    placeholder="Input task title"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    {...register("description")}
                    id="description"
                    defaultValue={item.description}
                    placeholder="Input task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      control={methods.control}
                      name="status"
                      defaultValue={item.status ?? undefined}
                      render={({ field }) => (
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="status" className="w-full">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              StatusEnum.NOT_STARTED,
                              StatusEnum.IN_PROGRESS,
                              StatusEnum.DONE,
                            ].map((status) => (
                              <SelectItem
                                key={status}
                                value={status}
                                className={statusColorMap[status]}
                              >
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="priority">Priority</Label>
                    <Controller
                      control={methods.control}
                      name="priority"
                      defaultValue={item.status ?? undefined}
                      render={({ field }) => (
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="priority" className="w-full">
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              PriorityEnum.LOW,
                              PriorityEnum.MEDIUM,
                              PriorityEnum.HIGH,
                            ].map((prio) => (
                              <SelectItem
                                value={prio}
                                key={prio}
                                className={priorityColorMap[prio]}
                              >
                                {prio}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="user">Assignee</Label>
                  <Controller
                    control={methods.control}
                    name="assignedTo"
                    defaultValue={item.status ?? undefined}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <SelectTrigger id="user" className="w-full">
                          <SelectValue placeholder="Assign to user" />
                        </SelectTrigger>
                        <SelectContent>
                          {userData.map((user) => (
                            <SelectItem value={user._id} key={user._id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="user">Due Date</Label>
                  <Controller
                    control={methods.control}
                    name="dueDate"
                    defaultValue={item.dueDate ?? undefined}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="dueDate"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value as any}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="project">Project</Label>
                  <Controller
                    control={methods.control}
                    name="projectId"
                    defaultValue={item.status ?? undefined}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value ?? undefined}
                      >
                        <SelectTrigger id="project" className="w-full">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectData.map((project) => (
                            <SelectItem value={project._id} key={project._id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button type="submit">Done</Button>
              </DrawerClose>
              {!isNew && (
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </DrawerFooter>
          </form>
        </FormProvider>
      </DrawerContent>
    </Drawer>
  );
}
