import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import {
    Box,
    Button,
    Checkbox,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    FieldArray,
    getIn,
    useFormikContext,
} from "formik";

import type {
    TaskFormValues,
} from "@/modules/tasks/types/task-form.type";

export const SubTaskComponent = () => {
    const {
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        touched,
        errors,
    } =
        useFormikContext<TaskFormValues>();

    return (
        <FieldArray name="subTasks">
            {({ push, remove }) => (
                <Stack spacing={2}>
                    {values.subTasks.length > 0 && (
                        <Typography variant="subtitle1">
                            Subtarefas
                        </Typography>
                    )}

                    {values.subTasks.map(
                        (subTask, index) => {
                            const titlePath =
                                `subTasks.${index}.title`;

                            const descriptionPath =
                                `subTasks.${index}.description`;

                            const titleTouched =
                                getIn(
                                    touched,
                                    titlePath,
                                );

                            const titleError =
                                getIn(
                                    errors,
                                    titlePath,
                                );

                            const descriptionTouched =
                                getIn(
                                    touched,
                                    descriptionPath,
                                );

                            const descriptionError =
                                getIn(
                                    errors,
                                    descriptionPath,
                                );

                            return (
                                <Box
                                    key={subTask.id ?? index}
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "flex-start",
                                        gap: 1,
                                        p: 2,
                                        border: 1,
                                        borderColor:
                                            "divider",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Checkbox
                                        checked={
                                            subTask.status ===
                                            "COMPLETED"
                                        }
                                        onChange={(event) =>
                                            setFieldValue(
                                                `subTasks.${index}.status`,
                                                event.target.checked
                                                    ? "COMPLETED"
                                                    : "PENDING",
                                            )
                                        }
                                    />

                                    <Stack
                                        spacing={1.5}
                                        sx={{
                                            flex: 1,
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Título"
                                            name={titlePath}
                                            value={
                                                subTask.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onBlur={
                                                handleBlur
                                            }
                                            error={
                                                Boolean(
                                                    titleTouched,
                                                ) &&
                                                Boolean(
                                                    titleError,
                                                )
                                            }
                                            helperText={
                                                titleTouched
                                                    ? titleError
                                                    : undefined
                                            }
                                        />

                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={2}
                                            size="small"
                                            label="Descrição"
                                            name={
                                                descriptionPath
                                            }
                                            value={
                                                subTask.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            onBlur={
                                                handleBlur
                                            }
                                            error={
                                                Boolean(
                                                    descriptionTouched,
                                                ) &&
                                                Boolean(
                                                    descriptionError,
                                                )
                                            }
                                            helperText={
                                                descriptionTouched
                                                    ? descriptionError
                                                    : undefined
                                            }
                                        />

                                        <Stack
                                            direction={{
                                                xs: "column",
                                                sm: "row",
                                            }}
                                            spacing={1}
                                        >
                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                label="Status"
                                                name={
                                                    `subTasks.${index}.status`
                                                }
                                                value={
                                                    subTask.status
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >
                                                <MenuItem value="PENDING">
                                                    Pendente
                                                </MenuItem>

                                                <MenuItem value="IN_PROGRESS">
                                                    Em andamento
                                                </MenuItem>

                                                <MenuItem value="COMPLETED">
                                                    Concluída
                                                </MenuItem>

                                                <MenuItem value="CANCELLED">
                                                    Cancelada
                                                </MenuItem>
                                            </TextField>

                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                label="Prioridade"
                                                name={
                                                    `subTasks.${index}.priority`
                                                }
                                                value={
                                                    subTask.priority
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >
                                                <MenuItem value="LOW">
                                                    Baixa
                                                </MenuItem>

                                                <MenuItem value="MEDIUM">
                                                    Média
                                                </MenuItem>

                                                <MenuItem value="HIGH">
                                                    Alta
                                                </MenuItem>

                                                <MenuItem value="URGENT">
                                                    Urgente
                                                </MenuItem>
                                            </TextField>
                                        </Stack>
                                    </Stack>

                                    <IconButton
                                        type="button"
                                        color="error"
                                        aria-label="Remover subtarefa"
                                        onClick={() =>
                                            remove(index)
                                        }
                                    >
                                        <DeleteRoundedIcon />
                                    </IconButton>
                                </Box>
                            );
                        },
                    )}

                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={
                            <AddRoundedIcon />
                        }
                        onClick={() =>
                            push({
                                title: "",
                                description: "",
                                status: "PENDING",
                                priority: "MEDIUM",
                            })
                        }
                    >
                        Adicionar subtarefa
                    </Button>
                </Stack>
            )}
        </FieldArray>
    );
};
