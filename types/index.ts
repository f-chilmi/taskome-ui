export enum StatusEnum {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
}

export enum PriorityEnum {
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export interface Task {
  title: string;
  description?: string;
  status?: StatusEnum;
  priority?: PriorityEnum;
  dueDate?: Date | string;
  assignedTo?: string;
  projectId?: string;

  userAssigned?: User;
  project?: Project;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: RoleEnum;
}

export enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}

export interface Project {
  name: string;
  description?: string;
}
