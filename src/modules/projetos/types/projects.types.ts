export type ProjectId = string;

export type Project = {
    id: ProjectId;
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
    total: number;
    completed: number;
    pending: number;
    percentage: number;
};


export type CreateProjectInput = Pick<Project, 'name' | 'description'>;

export type UpdateProjectInput = Partial<CreateProjectInput>;