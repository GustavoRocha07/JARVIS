import type { TimerSession } from "../types/timer-session.type";

const isTaskSession = (session: TimerSession, taskId: number) =>
  session.target.type === "TASK" && session.target.taskId === taskId;

const isSubTaskSession = (
  session: TimerSession,
  taskId: number,
  subTaskId: string,
) =>
  session.target.type === "SUBTASK" &&
  session.target.taskId === taskId &&
  session.target.subTaskId === subTaskId;

export const getTaskDirectSessions = (
  taskId: number,
  sessions: TimerSession[],
): TimerSession[] => sessions.filter((session) => isTaskSession(session, taskId));

export const getTaskSessions = (
  taskId: number,
  sessions: TimerSession[],
): TimerSession[] =>
  sessions
    .filter((session) => session.target.taskId === taskId)
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

export const getSubTaskSessions = (
  taskId: number,
  subTaskId: string,
  sessions: TimerSession[],
): TimerSession[] =>
  sessions.filter((session) => isSubTaskSession(session, taskId, subTaskId));

export const getTaskDirectWorkedSeconds = (
  taskId: number,
  sessions: TimerSession[],
): number =>
  getTaskDirectSessions(taskId, sessions).reduce(
    (total, session) => total + session.workedSeconds,
    0,
  );

export const getSubTaskWorkedSeconds = (
  taskId: number,
  subTaskId: string,
  sessions: TimerSession[],
): number =>
  getSubTaskSessions(taskId, subTaskId, sessions).reduce(
    (total, session) => total + session.workedSeconds,
    0,
  );

export const getTaskTotalWorkedSeconds = (
  taskId: number,
  sessions: TimerSession[],
): number =>
  getTaskSessions(taskId, sessions).reduce(
    (total, session) => total + session.workedSeconds,
    0,
  );

export const getTaskCompletedFocusCount = (
  taskId: number,
  sessions: TimerSession[],
): number =>
  getTaskSessions(taskId, sessions).filter(
    (session) => session.completedFocus,
  ).length;

export const getTaskDirectCompletedFocusCount = (
  taskId: number,
  sessions: TimerSession[],
): number =>
  getTaskDirectSessions(taskId, sessions).filter(
    (session) => session.completedFocus,
  ).length;

export const getSubTaskCompletedFocusCount = (
  taskId: number,
  subTaskId: string,
  sessions: TimerSession[],
): number =>
  getSubTaskSessions(taskId, subTaskId, sessions).filter(
    (session) => session.completedFocus,
  ).length;
