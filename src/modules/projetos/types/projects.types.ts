
export type Project = {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    archivedAt: string | null;
}

export type ProjectFormValues = {
    name: string;
    description: string;
};

export type ProjectProgress = {
    totalTasks: number;
    completedTasks: number;
    percentage: number;
};

