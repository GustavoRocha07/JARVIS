import type { Project, ProjectId } from "../types/projects.types";

// Contrato síncrono compartilhado pelos adapters de persistência.
export interface ProjectRepository {
    getAll(): Project[];
    getById(id: ProjectId): Project | null;
    save(project: Project): void;
}
