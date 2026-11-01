import type { Project } from "../types/projects.types";

export const isProjectFromStorage = (
    value: unknown,
): value is Project => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    return (
        "id" in value &&
        typeof value.id === "string" &&

        "name" in value &&
        typeof value.name === "string" &&

        "description" in value &&
        typeof value.description === "string" &&

        "createdAt" in value &&
        typeof value.createdAt === "string" &&

        "updatedAt" in value &&
        typeof value.updatedAt === "string" &&

        "archivedAt" in value &&
        (value.archivedAt === null ||
            typeof value.archivedAt === "string")
    );
};