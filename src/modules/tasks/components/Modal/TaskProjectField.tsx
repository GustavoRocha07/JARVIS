import { useEffect, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { useField } from "formik";
import { projectService } from "@/modules/projetos/services/project.service";
import type { Project } from "@/modules/projetos/types/projects.types";

export const TaskProjectField = () => {
  const [field, meta, helpers] = useField<string | null>("projectId");
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    projectService.getAll().then((projects) => {
      if (active) setProjects(projects);
    }).catch(() => {
      if (active) setError("Não foi possível carregar os projetos. Feche e abra a tarefa para tentar novamente.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);
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
      disabled={loading || Boolean(error)}
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
