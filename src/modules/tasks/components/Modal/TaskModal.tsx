import { useMemo } from "react";

import {
  FormikProvider,
  useFormik,
} from "formik";

import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { ptBR } from "date-fns/locale/pt-BR";

import { ModalComponent } from "@/shared/components/ModalComponent";

import { SubTaskComponent } from "@/modules/subtasks/components/SubTaskForm/SubTaskForm";

import type {
  TaskModalProps,
} from "../../types/tasks.type";

import type {
  TaskFormValues,
} from "../../types/task-form.type";

import {
  validationSchema,
} from "../../schema/TaskValidation.schema";

import {
  formValuesToCreateTask,
  formValuesToUpdateTask,
  taskToFormValues,
} from "../../mappers/task.mapper";

export const TaskModal = ({
  open,
  title,
  initialData,
  onClose,
  onSubmit,
}: TaskModalProps) => {
  const formId = "task-form";

  const isEditing =
    initialData !== null &&
    initialData !== undefined;

  const initialValues =
    useMemo<TaskFormValues>(
      () =>
        taskToFormValues(
          initialData,
        ),
      [initialData],
    );

  const formik =
    useFormik<TaskFormValues>({
      initialValues,

      validationSchema,

      enableReinitialize: true,

      onSubmit: (values) => {
        if (
          isEditing &&
          initialData
        ) {
          onSubmit({
            action: "UPDATE",

            task:
              formValuesToUpdateTask(
                initialData.id,
                values,
              ),

            subTasks:
              values.subTasks,
          });

          return;
        }

        onSubmit({
          action: "CREATE",

          task:
            formValuesToCreateTask(
              values,
            ),

          subTasks:
            values.subTasks,
        });
      },
    });

  const handleClose = () => {
    formik.resetForm();

    onClose();
  };

  return (
    <FormikProvider value={formik}>
      <ModalComponent
        open={open}
        onClose={handleClose}
        title={
          title ||
          (isEditing
            ? initialData?.title
            : "Cadastrar Tarefa")
        }
        fullWidth
        maxWidth="md"
        actions={
          <Stack
          
          >
            <Button
              type="button"
              variant="outlined"
              onClick={handleClose}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              form={formId}
              variant="contained"
              disabled={formik.isSubmitting}
            >
              {isEditing
                ? "Salvar alterações"
                : "Criar tarefa"}
            </Button>
          </Stack>
        }
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={ptBR}
        >
          <Box
            id={formId}
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                name="title"
                label="Título"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  Boolean(
                    formik.touched.title,
                  ) &&
                  Boolean(
                    formik.errors.title,
                  )
                }
                helperText={
                  formik.touched.title
                    ? formik.errors.title
                    : undefined
                }
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Descrição"
                value={
                  formik.values.description
                }
                onChange={
                  formik.handleChange
                }
                onBlur={
                  formik.handleBlur
                }
                error={
                  Boolean(
                    formik.touched
                      .description,
                  ) &&
                  Boolean(
                    formik.errors
                      .description,
                  )
                }
                helperText={
                  formik.touched
                    .description
                    ? formik.errors
                      .description
                    : undefined
                }
              />

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                <TextField
                  select
                  fullWidth
                  name="status"
                  label="Status"
                  value={
                    formik.values.status
                  }
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
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
                  name="priority"
                  label="Prioridade"
                  value={
                    formik.values.priority
                  }
                  onChange={
                    formik.handleChange
                  }
                  onBlur={
                    formik.handleBlur
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

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                {isEditing &&
                  initialData?.createdAt && (
                    <DatePicker
                      label="Data de Criação"
                      format="dd/MM/yyyy"
                      value={
                        initialData.createdAt
                      }
                      disabled
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  )}

                <DatePicker
                  label="Data de Vencimento"
                  format="dd/MM/yyyy"
                  value={
                    formik.values.dueDate
                  }
                  onChange={(value) => {
                    if (!value) {
                      return;
                    }

                    formik.setFieldValue(
                      "dueDate",
                      value,
                    );
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,

                      onBlur: () => {
                        formik.setFieldTouched(
                          "dueDate",
                          true,
                        );
                      },

                      error:
                        Boolean(
                          formik.touched
                            .dueDate,
                        ) &&
                        Boolean(
                          formik.errors
                            .dueDate,
                        ),

                      helperText:
                        formik.touched
                          .dueDate &&
                          typeof formik
                            .errors
                            .dueDate ===
                          "string"
                          ? formik
                            .errors
                            .dueDate
                          : undefined,
                    },
                  }}
                />
              </Stack>

              <SubTaskComponent />
            </Stack>
          </Box>
        </LocalizationProvider>
      </ModalComponent>
    </FormikProvider>
  );
};