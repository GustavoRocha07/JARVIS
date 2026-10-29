import type { Project, ProjectId } from "../types/projects.types";

// Contrato síncrono compartilhado pelos adapters de persistência.
export interface ProjectRepository {
    getAll(): Promise<Project[]>;
    getById(id: ProjectId): Promise<Project | null>;
    save(project: Project): Promise<void>;
}
