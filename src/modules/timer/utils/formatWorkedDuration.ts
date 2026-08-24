export const formatWorkedDuration = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  if (safeSeconds < 60) {
    return `${safeSeconds}s`;
  }

  const totalMinutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (totalMinutes < 60) {
    return seconds > 0
      ? `${totalMinutes}min ${String(seconds).padStart(2, "0")}s`
      : `${totalMinutes}min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return minutes > 0
    ? `${hours}h ${String(minutes).padStart(2, "0")}min`
    : `${hours}h`;
};
