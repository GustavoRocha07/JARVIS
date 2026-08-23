import { useMemo } from "react";

import {
  FormikProvider,
  useFormik,
} from "formik";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR").format(date);

export const TaskModal = ({
  open,
  title,
  mode,
  initialData,
  onClose,
  onModeChange,
  onSubTaskComplete,
  onSubmit,
}: TaskModalProps) => {
  const formId = "task-form";

  const isCreate = mode === "create";
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const initialValues = useMemo<TaskFormValues>(
    () => taskToFormValues(initialData),
    [initialData],
  );

  const formik = useFormik<TaskFormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,

    onSubmit: (values) => {
      if (isEdit && initialData) {
        onSubmit({
          action: "UPDATE",
          task: formValuesToUpdateTask(
            initialData.id,
            values,
          ),
          subTasks: values.subTasks,
        });

        return;
      }

      onSubmit({
        action: "CREATE",
        task: formValuesToCreateTask(values),
        subTasks: values.subTasks,
      });
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleCancel = () => {
    formik.resetForm();

    if (isEdit && initialData) {
      onModeChange("view");
      return;
    }

    onClose();
  };

  const actions = isView ? (
    <Stack direction="row" spacing={1}>
      <Button
        type="button"
        variant="outlined"
        onClick={handleClose}
      >
        Fechar
      </Button>

      <Button
        type="button"
        variant="contained"
        onClick={() => onModeChange("edit")}
      >
        Editar
      </Button>
    </Stack>
  ) : (
    <Stack direction="row" spacing={1}>
      <Button
        type="button"
        variant="outlined"
        onClick={handleCancel}
      >
        Cancelar
      </Button>

      <Button
        type="submit"
        form={formId}
        variant="contained"
        disabled={formik.isSubmitting}
      >
        {isCreate
          ? "Criar tarefa"
          : "Salvar alterações"}
      </Button>
    </Stack>
  );

  return (
    <FormikProvider value={formik}>
      <ModalComponent
        open={open}
        onClose={handleClose}
        title={
          title ||
          initialData?.title ||
          "Cadastrar Tarefa"
        }
        fullWidth
        maxWidth="md"
        actions={actions}
      >
        {isView && initialData ? (
          <Stack spacing={2.5}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Título
              </Typography>
              <Typography variant="h6">
                {initialData.title}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Descrição
              </Typography>
              <Typography variant="body1">
                {initialData.description || "Sem descrição"}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Status
                </Typography>
                <Typography variant="body2">
                  {initialData.status}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Prioridade
                </Typography>
                <Typography variant="body2">
                  {initialData.priority}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Vencimento
                </Typography>
                <Typography variant="body2">
                  {formatDate(initialData.dueDate)}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1 }}
              >
                Subtarefas
              </Typography>

              {initialData.subTasks?.length ? (
                <Stack spacing={0.75}>
                  {initialData.subTasks.map((subTask) => (
                    <Box
                      key={subTask.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1,
                        py: 0.75,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1.5,
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={subTask.completed}
                        onChange={(event) =>
                          onSubTaskComplete(
                            subTask,
                            event.target.checked,
                          )
                        }
                        icon={
                          <RadioButtonUncheckedIcon fontSize="small" />
                        }
                        checkedIcon={
                          <CheckCircleIcon fontSize="small" />
                        }
                      />

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            textDecoration: subTask.completed
                              ? "line-through"
                              : "none",
                            opacity: subTask.completed
                              ? 0.65
                              : 1,
                          }}
                        >
                          {subTask.title}
                        </Typography>

                        {subTask.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {subTask.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Nenhuma subtarefa cadastrada.
                </Typography>
              )}
            </Box>
          </Stack>
        ) : (
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
                    Boolean(formik.touched.title) &&
                    Boolean(formik.errors.title)
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
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    Boolean(formik.touched.description) &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description
                      ? formik.errors.description
                      : undefined
                  }
                />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                >
                  <TextField
                    select
                    fullWidth
                    name="status"
                    label="Status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="LOW">Baixa</MenuItem>
                    <MenuItem value="MEDIUM">Média</MenuItem>
                    <MenuItem value="HIGH">Alta</MenuItem>
                    <MenuItem value="URGENT">Urgente</MenuItem>
                  </TextField>
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                >
                  {!isCreate &&
                    initialData?.createdAt && (
                      <DatePicker
                        label="Data de Criação"
                        format="dd/MM/yyyy"
                        value={initialData.createdAt}
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
                    value={formik.values.dueDate}
                    onChange={(value) => {
                      if (!value) return;

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
                          Boolean(formik.touched.dueDate) &&
                          Boolean(formik.errors.dueDate),
                        helperText:
                          formik.touched.dueDate &&
                            typeof formik.errors.dueDate ===
                            "string"
                            ? formik.errors.dueDate
                            : undefined,
                      },
                    }}
                  />
                </Stack>

                <SubTaskComponent />
              </Stack>
            </Box>
          </LocalizationProvider>
        )}
      </ModalComponent>
    </FormikProvider>
  );
};
