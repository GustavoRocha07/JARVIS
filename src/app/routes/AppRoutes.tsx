import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/layout/AppLayout';
import { TasksPage } from '@/modules/tasks/pages';
import { ProjectsPage } from '@/modules/projetos/pages/ProjectsPage';
import { DetalhamentoProjectPage } from '@/modules/projetos/pages/DetalhamentoProjectPage';


export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/tasks" replace />} />

        <Route path="/tasks" element={<TasksPage />} />

        <Route path="/projects" element={<ProjectsPage />} />

        <Route
          path="/projects/:projectId"
          element={<DetalhamentoProjectPage />}
        />

        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Route>
    </Routes>
  );
}