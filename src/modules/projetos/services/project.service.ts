import { listProjectTasksForArchive } from "@/modules/tasks/services/tasks.service";
import { localStorageProjectRepository } from "../repositories/localStorageProjectRepository";
import { createProjectService } from "./createProjectService";

// Montagem da aplicação: os consumidores mantêm a mesma instância pública.
export const projectService = createProjectService(localStorageProjectRepository, listProjectTasksForArchive);
