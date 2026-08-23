import * as Yup from "yup";

import type {
    TaskFormValues,
} from "../types/task-form.type";

const subTaskValidationSchema = Yup.object({
    title: Yup.string()
        .trim()
        .min(
            3,
            "O título da subtarefa deve ter pelo menos 3 caracteres",
        )
        .required(
            "O título da subtarefa é obrigatório",
        ),

    description: Yup.string()
        .trim()
        .min(
            3,
            "A descrição da subtarefa deve ter pelo menos 3 caracteres",
        )
        .required(
            "A descrição da subtarefa é obrigatória",
        ),

    status: Yup.string()
        .oneOf([
            "PENDING",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
        ])
        .required(
            "Selecione o status da subtarefa",
        ),

    priority: Yup.string()
        .oneOf([
            "LOW",
            "MEDIUM",
            "HIGH",
            "URGENT",
        ])
        .required(
            "Selecione a prioridade da subtarefa",
        ),
});

export const validationSchema: Yup.ObjectSchema<TaskFormValues> =
    Yup.object({
        title: Yup.string()
            .trim()
            .min(
                3,
                "O título deve ter pelo menos 3 caracteres",
            )
            .required(
                "O título é obrigatório",
            ),

        description: Yup.string()
            .trim()
            .min(
                3,
                "A descrição deve ter pelo menos 3 caracteres",
            )
            .required(
                "A descrição é obrigatória",
            ),

        status: Yup.string()
            .oneOf([
                "PENDING",
                "IN_PROGRESS",
                "COMPLETED",
                "CANCELLED",
            ])
            .required(
                "Selecione o status",
            ),

        priority: Yup.string()
            .oneOf([
                "LOW",
                "MEDIUM",
                "HIGH",
                "URGENT",
            ])
            .required(
                "Selecione a prioridade",
            ),

        dueDate: Yup.date()
            .typeError(
                "Informe uma data de entrega válida",
            )
            .required(
                "Data de entrega é obrigatória",
            ),

        subTasks: Yup.array()
            .of(subTaskValidationSchema)
            .default([]),
    });