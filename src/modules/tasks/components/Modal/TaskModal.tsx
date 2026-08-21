import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { ptBR } from "date-fns/locale/pt-BR";

import { ModalComponent } from "@/shared/components/ModalComponent";

import type {
  CreateTask,
  Task,
  TaskSubmit,
  UpdateTask,
} from "../../types/tasks.type";

type TaskModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
};

export interface ExtendedTaskModalProps extends TaskModalProps {
  initialData?: Task | null;
  onSubmit: (values: TaskSubmit) => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("O título é obrigatório"),

  description: Yup.string().required(
    "A descrição é obrigatória",
  ),

  status: Yup.string().required(
    "Selecione o status",
  ),

  priority: Yup.string().required(
    "Selecione a prioridade",
  ),

  createdAt: Yup.date()
    .nullable()
    .optional(),

  dueDate: Yup.date()
    .nullable()
    .required("Data de entrega é obrigatória")
    .test(
      "is-after-created",
      "A data de entrega deve ser posterior à criação",
      function (dueDate) {
        const { createdAt } = this.parent;

        if (!dueDate || !createdAt) {
          return true;
        }

        return (
          new Date(dueDate) >=
          new Date(createdAt)
        );
      },
    ),
});

const defaultValues: CreateTask = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: new Date(),
};

export const TaskModal = ({
  open,
  onClose,
  title,
  initialData,
  onSubmit,
}: ExtendedTaskModalProps) => {
  const isEditing = Boolean(initialData?.id);

  const formId = "task-form";

  const formik = useFormik<Task | CreateTask>({
    initialValues: initialData ?? defaultValues,

    validationSchema,

    enableReinitialize: true,

    onSubmit: (values) => {
      if (isEditing && initialData) {
        const updateTask: UpdateTask = {
          id: initialData.id,
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          dueDate: values.dueDate,

        };

        const payload: TaskSubmit = {
          action: "UPDATE",
          data: updateTask,
        };

        onSubmit(payload);
        return;
      }

      const createTask: CreateTask = {
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate,
      };

      const payload: TaskSubmit = {
        action: "CREATE",
        data: createTask,
      };

      onSubmit(payload);
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [formik, open]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const renderActions = (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <Button
        variant="outlined"
        onClick={handleClose}
      >
        Cancelar
      </Button>

      <Button
        type="submit"
        form={formId}
        variant="contained"
      >
        {isEditing
          ? "Salvar Alterações"
          : "Criar Tarefa"}
      </Button>
    </Stack>
  );

  return (
    <ModalComponent
      open={open}
      onClose={handleClose}
      title={
        title ||
        (isEditing
          ? "Editar Tarefa"
          : "Criar Nova Tarefa")
      }
      actions={renderActions}
      fullWidth
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
          sx={{ mt: 1 }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Título"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.title &&
                Boolean(formik.errors.title)
              }
              helperText={
                formik.touched.title &&
                formik.errors.title
              }
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              id="description"
              name="description"
              label="Descrição"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description &&
                Boolean(
                  formik.errors.description,
                )
              }
              helperText={
                formik.touched.description &&
                formik.errors.description
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
                id="status"
                name="status"
                label="Status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.status &&
                  Boolean(formik.errors.status)
                }
                helperText={
                  formik.touched.status &&
                  formik.errors.status
                }
              >
                <MenuItem value="PENDING">
                  Pendente
                </MenuItem>

                <MenuItem value="IN_PROGRESS">
                  Em Andamento
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
                id="priority"
                name="priority"
                label="Prioridade"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.priority &&
                  Boolean(
                    formik.errors.priority,
                  )
                }
                helperText={
                  formik.touched.priority &&
                  formik.errors.priority
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
                "createdAt" in formik.values && (
                  <DatePicker
                    label="Data de Criação"
                    format="dd/MM/yyyy"
                    value={
                      formik.values.createdAt
                        ? new Date(
                          formik.values
                            .createdAt,
                        )
                        : null
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
                    ? new Date(
                      formik.values.dueDate,
                    )
                    : null
                }
                onChange={(value) => {
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
                      formik.touched.dueDate &&
                      Boolean(
                        formik.errors.dueDate,
                      ),

                    helperText:
                      formik.touched.dueDate &&
                        typeof formik.errors
                          .dueDate === "string"
                        ? formik.errors.dueDate
                        : "",
                  },
                }}
              />
            </Stack>
          </Stack>
        </Box>
      </LocalizationProvider>
    </ModalComponent>
  );
};