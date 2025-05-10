import { z } from "zod";

export const projectSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  userAssigned: z
    .object({
      _id: z.string(),
      name: z.string(),
      email: z.string(),
    })
    .optional(),
  project: z
    .object({
      _id: z.string(),
      title: z.string(),
      description: z.string(),
    })
    .optional(),
  projectId: z.string().optional(),
  assignedTo: z.string().optional(),
});
export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
});
