import type { Task } from "@/modules/tasks/types/tasks.type";

export type ProjectId = string;

export type Project = {
    id: ProjectId;
    name: string;
    description: string;
    dueDate?: string;
    tasks?: Task[]
    createdAt: string;
    updatedAt: string;
    archivedAt: string | null;
}

export type ProjectFormValues = {
    name: string;
    description: string;
    dueDate?: string;
};

export type ProjectProgress = {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
};


export type CreateProjectInput = Pick<Project, 'name' | 'description' | 'dueDate'>;

export type UpdateProjectInput = Partial<CreateProjectInput>;