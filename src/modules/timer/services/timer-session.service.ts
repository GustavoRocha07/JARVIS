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

    if (!("type" in value.target) || !("taskId" in value.target)) {
        return false;
    }

    const hasValidTaskId = typeof value.target.taskId === "number";

    const hasValidTarget = value.target.type === "TASK"
        ? hasValidTaskId
        : value.target.type === "SUBTASK" &&
          hasValidTaskId &&
          "subTaskId" in value.target &&
          typeof value.target.subTaskId === "string";

    return (
        typeof value.id === "string" &&
        hasValidTarget &&
        isValidDate(value.startedAt) &&
        isValidDate(value.finishedAt) &&
        typeof value.workedSeconds === "number" &&
        value.workedSeconds >= 0 &&
        typeof value.completedFocus === "boolean"
    );
};

const saveTimerSessions = (sessions: TimerSession[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
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

    saveTimerSessions([...sessions, newSession]);

    return newSession;
};

export const handleDeleteTimerSessionsByTaskIdService = (
    taskId: number,
): void => {
    const sessions = handleListTimerSessionsService();
    saveTimerSessions(
        sessions.filter((session) => session.target.taskId !== taskId),
    );
};

export const handleDeleteTimerSessionsBySubTaskIdService = (
    taskId: number,
    subTaskId: string,
): void => {
    const sessions = handleListTimerSessionsService();
    saveTimerSessions(
        sessions.filter((session) =>
            !(
                session.target.type === "SUBTASK" &&
                session.target.taskId === taskId &&
                session.target.subTaskId === subTaskId
            ),
        ),
    );
};
