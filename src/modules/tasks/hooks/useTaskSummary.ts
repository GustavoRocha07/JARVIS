import { useMemo } from "react";

import { useTasksData } from "../contexts/useTasksData";

export const useTaskSummary = () => {
  const { summary, tasks } = useTasksData();

  const overdue = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (task.status === "COMPLETED" || task.status === "CANCELLED") {
        return false;
      }

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate < today;
    }).length;
  }, [tasks]);

  return {
    ...summary,
    overdue,
  };
};
