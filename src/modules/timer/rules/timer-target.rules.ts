import type { TimerState } from "../types/timer.type";

const hasLockedTimerTarget = (timer: TimerState): boolean =>
  timer.status !== "IDLE" && timer.target !== null;

export const isTaskLockedByTimer = (
  timer: TimerState,
  taskId: number,
): boolean =>
  hasLockedTimerTarget(timer) && timer.target?.taskId === taskId;

export const isSubTaskLockedByTimer = (
  timer: TimerState,
  taskId: number,
  subTaskId: string,
): boolean =>
  hasLockedTimerTarget(timer) &&
  timer.target?.type === "SUBTASK" &&
  timer.target.taskId === taskId &&
  timer.target.subTaskId === subTaskId;
