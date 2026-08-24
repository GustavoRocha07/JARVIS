import type {
    CreateTimerSession,
    TimerSession,
} from "../types/timer-session.type";

const STORAGE_KEY = "jarvis:timer-sessions";

type StoredTimerSession = Omit<
    TimerSession,
    "startedAt" | "finishedAt"
> & {
    startedAt: string;
    finishedAt: string;
};

const isValidDate = (value: unknown): value is string =>
    typeof value === "string" &&
    !Number.isNaN(new Date(value).getTime());

const isStoredTimerSession = (
    value: unknown,
): value is StoredTimerSession => {
    if (typeof value !== "object" || value === null) return false;

    if (!("id" in value)) return false;
    if (!("target" in value)) return false;
    if (!("startedAt" in value)) return false;
    if (!("finishedAt" in value)) return false;
    if (!("workedSeconds" in value)) return false;
    if (!("completedFocus" in value)) return false;

    if (typeof value.target !== "object" || value.target === null) {
        return false;
    }

    if (!("id" in value.target) || !("type" in value.target)) {
        return false;
    }

    const hasValidTargetId =
        typeof value.target.id === "number" ||
        typeof value.target.id === "string";

    const hasValidTargetType =
        value.target.type === "TASK" ||
        value.target.type === "SUBTASK";

    return (
        typeof value.id === "string" &&
        hasValidTargetId &&
        hasValidTargetType &&
        isValidDate(value.startedAt) &&
        isValidDate(value.finishedAt) &&
        typeof value.workedSeconds === "number" &&
        value.workedSeconds >= 0 &&
        typeof value.completedFocus === "boolean"
    );
};

export const handleListTimerSessionsService = (): TimerSession[] => {
    const rawData = localStorage.getItem(STORAGE_KEY);

    if (!rawData) return [];

    try {
        const parsed: unknown = JSON.parse(rawData);

        if (!Array.isArray(parsed)) return [];

        return parsed.filter(isStoredTimerSession).map((session) => ({
            ...session,
            startedAt: new Date(session.startedAt),
            finishedAt: new Date(session.finishedAt),
        }));
    } catch {
        return [];
    }
};

export const handleCreateTimerSessionService = (
    data: CreateTimerSession,
): TimerSession => {
    const sessions = handleListTimerSessionsService();
    const newSession: TimerSession = {
        ...data,
        id: crypto.randomUUID(),
    };

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...sessions, newSession]),
    );

    return newSession;
};
