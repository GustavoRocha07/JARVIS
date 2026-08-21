import type { ApiError } from "@/types/Api.type";

export const isApiError = (error: unknown): error is ApiError => {
    if (
        typeof error !== 'object' ||
        error === null
    ) {
        return false;
    }

    return (
        'status' in error &&
        typeof error.status === 'number' &&
        'message' in error &&
        typeof error.message === 'string' &&
        'success' in error &&
        typeof error.success === 'boolean'
    );
};