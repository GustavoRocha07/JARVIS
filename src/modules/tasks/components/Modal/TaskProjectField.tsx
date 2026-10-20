import { useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { useField } from "formik";
import { projectRepository } from "@/modules/projetos/services/projectRepository";
import type { Project } from "@/modules/projetos/types/projects.types";

export const TaskProjectField = () => {
  const [field, meta, helpers] = useField<string | null>("projectId");
  const [{ projects, error }] = useState(() => {
    try {
      return { projects: projectRepository.getAll(), error: "" };
    } catch {
      return {
        projects: [] as Project[],
        error: "Não foi possível carregar os projetos. Feche e abra a tarefa para tentar novamente.",
      };
    }
  });
  const selected = projects.find((project) => project.id === field.value);
  const activeProjects = projects.filter((project) => project.archivedAt === null);

  return (
    <TextField
      select
      fullWidth
      name={field.name}
      label="Projeto (opcional)"
      value={field.value ?? ""}
      onChange={(event) => helpers.setValue(event.target.value || null)}
      onBlur={field.onBlur}
      disabled={Boolean(error)}
      error={Boolean(error || (meta.touched && meta.error))}
      helperText={error || (meta.touched && meta.error) || "Vincule a tarefa a um projeto ou mantenha Sem projeto."}
    >
      <MenuItem value="">Sem projeto</MenuItem>
      {activeProjects.map((project) => (
        <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
      ))}
      {selected && selected.archivedAt !== null && (
        <MenuItem value={selected.id} disabled>{selected.name} (arquivado)</MenuItem>
      )}
      {field.value && !selected && (
        <MenuItem value={field.value} disabled>Projeto indisponível</MenuItem>
      )}
    </TextField>
  );
};
