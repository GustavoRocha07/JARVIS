import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/layout/AppLayout';
import { TasksPage } from '@/modules/tasks/pages';



export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/tasks"
          element={<TasksPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />}
        />

      </Route>
    </Routes>
  );
}