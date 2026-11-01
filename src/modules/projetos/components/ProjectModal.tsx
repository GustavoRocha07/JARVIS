
import { useState, type FormEvent } from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from "@mui/material";

import type {
    Project,
    ProjectFormValues,
} from "../types/projects.types";

import type { ProjectModalMode } from "../hooks/useProjectsUI";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format, parseISO, isValid } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale/pt-BR";
type Props = {
    open: boolean;
    mode: ProjectModalMode;
    project: Project | null;
    onClose: () => void;
    onSubmit: (values: ProjectFormValues) => void;
};

type FormProps = Omit<Props, "open">;

const ProjectForm = ({
    mode,
    project,
    onClose,
    onSubmit,
}: FormProps) => {
    const [values, setValues] = useState<ProjectFormValues>(
        () => ({
            name: project?.name ?? "",
            description: project?.description ?? "",
            dueDate: project?.dueDate ?? ""
        }),
    );

    const [submitted, setSubmitted] = useState(false);

    const isView = mode === "view";

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitted(true);

        if (!values.name.trim() || isView) return;

        onSubmit({
            name: values.name.trim(),
            description: values.description.trim(),
            dueDate: values.dueDate
        });
    };

    const title = {
        create: "Novo projeto",
        edit: "Editar projeto",
        view: "Visualizar projeto",
    }[mode];

    return (

        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Nome do projeto"
                            value={values.name}
                            disabled={isView}
                            required={!isView}
                            error={submitted && !values.name.trim()}
                            helperText={
                                submitted && !values.name.trim()
                                    ? "Informe o nome do projeto"
                                    : ""
                            }
                            onChange={(event) =>
                                setValues((previous) => ({
                                    ...previous,
                                    name: event.target.value,
                                }))
                            }
                            fullWidth
                        />

                        <TextField
                            label="Descrição"
                            value={values.description}
                            disabled={isView}
                            multiline
                            minRows={3}
                            onChange={(event) =>
                                setValues((previous) => ({
                                    ...previous,
                                    description: event.target.value,
                                }))
                            }
                            fullWidth
                        />
                        <DatePicker
                            label="Data de Criação"
                            format="dd/MM/yyyy"
                            value={
                                values.dueDate
                                    ? parseISO(values.dueDate)
                                    : null
                            }
                            disabled={isView}
                            onChange={(date) => {
                                setValues((previous) => ({
                                    ...previous,
                                    dueDate:
                                        date && isValid(date)
                                            ? format(date, "yyyy-MM-dd")
                                            : "",
                                }));
                            }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose}>
                        {isView ? "Fechar" : "Cancelar"}
                    </Button>

                    {!isView && (
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            {mode === "create" ? "Criar" : "Salvar"}
                        </Button>
                    )}
                </DialogActions>
            </form>

        </LocalizationProvider>

    );
};

export const ProjectModal = ({
    open,
    mode,
    project,
    onClose,
    onSubmit,
}: Props) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            {open && (
                <ProjectForm
                    key={`${mode}-${project?.id ?? "new"}`}
                    mode={mode}
                    project={project}
                    onClose={onClose}
                    onSubmit={onSubmit}
                />
            )}
        </Dialog>
    );
};
