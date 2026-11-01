import {
    differenceInCalendarDays,
    isValid,
    parseISO,
} from "date-fns";

export const calculateProjectDeadline = (
    dueDate?: string | null,
    today: Date = new Date()
): number | null => {
    if (!dueDate) return null;

    const deadline = parseISO(dueDate);

    if (!isValid(deadline)) return null;

    return differenceInCalendarDays(deadline, today);
};