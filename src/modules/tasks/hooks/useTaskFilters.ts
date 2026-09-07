import { useMemo, useState } from "react";

import type { Task, TaskPriority, TaskStatus } from "../types/tasks.type";

export type TaskStatusFilter = "ALL" | TaskStatus;
export type TaskPriorityFilter = "ALL" | TaskPriority;
export type TaskDueFilter = "ALL" | "OVERDUE" | "TODAY" | "NEXT_7_DAYS";
export type TaskSort = "CREATED_DESC" | "DUE_ASC" | "DUE_DESC";

type UseTaskFiltersProps = {
  items: Task[];
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const useTaskFilters = ({ items }: UseTaskFiltersProps) => {
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>("ALL");
  const [dueFilter, setDueFilter] = useState<TaskDueFilter>("ALL");
  const [sort, setSort] = useState<TaskSort>("CREATED_DESC");

  const filteredItems = useMemo(() => {
    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextSevenDays = new Date(today);
    nextSevenDays.setDate(nextSevenDays.getDate() + 7);

    const filtered = items.filter((task) => {
      if (statusFilter !== "ALL" && task.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && task.priority !== priorityFilter) return false;

      const dueDate = startOfDay(task.dueDate);

      if (dueFilter === "OVERDUE") {
        return (
          task.status !== "COMPLETED" &&
          task.status !== "CANCELLED" &&
          dueDate < today
        );
      }

      if (dueFilter === "TODAY") {
        return dueDate >= today && dueDate < tomorrow;
      }

      if (dueFilter === "NEXT_7_DAYS") {
        return dueDate >= today && dueDate < nextSevenDays;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "DUE_ASC") {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }

      if (sort === "DUE_DESC") {
        return b.dueDate.getTime() - a.dueDate.getTime();
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [items, statusFilter, priorityFilter, dueFilter, sort]);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setDueFilter("ALL");
    setSort("CREATED_DESC");
  };

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    dueFilter !== "ALL" ||
    sort !== "CREATED_DESC";

  return {
    filteredItems,
    state: {
      statusFilter,
      priorityFilter,
      dueFilter,
      sort,
      hasActiveFilters,
    },
    actions: {
      setStatusFilter,
      setPriorityFilter,
      setDueFilter,
      setSort,
      clearFilters,
    },
  };
};
