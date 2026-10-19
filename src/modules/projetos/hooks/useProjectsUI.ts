
import { useCallback, useState } from "react";

import type { Project } from "../types/projects.types";

export type ProjectTab = "active" | "archived";

export type ProjectModalMode = "create" | "edit" | "view";

export type ProjectConfirmAction = "archive" | "restore";

export const useProjectsUI = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [activeTab, setActiveTab] =
        useState<ProjectTab>("active");

    const [openModal, setOpenModal] = useState(false);

    const [modalMode, setModalMode] =
        useState<ProjectModalMode>("create");

    const [selectedProject, setSelectedProject] =
        useState<Project | null>(null);

    const [confirmAction, setConfirmAction] =
        useState<ProjectConfirmAction | null>(null);

    const [openConfirmModal, setOpenConfirmModal] =
        useState(false);

    const [projectToConfirm, setProjectToConfirm] =
        useState<Project | null>(null);

    // Busca
    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchTerm(value);
        },
        [],
    );

    // Abas
    const handleTabChange = useCallback(
        (tab: ProjectTab) => {
            setActiveTab(tab);
        },
        [],
    );

    // Modal de criação
    const handleOpenCreateModal = useCallback(() => {
        setSelectedProject(null);
        setModalMode("create");
        setOpenModal(true);
    }, []);

    // Modal de edição
    const handleOpenEditModal = useCallback(
        (project: Project) => {
            setSelectedProject(project);
            setModalMode("edit");
            setOpenModal(true);
        },
        [],
    );

    // Modal de visualização
    const handleOpenViewModal = useCallback(
        (project: Project) => {
            setSelectedProject(project);
            setModalMode("view");
            setOpenModal(true);
        },
        [],
    );

    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setSelectedProject(null);
        setModalMode("create");
    }, []);

    // Confirmação de arquivamento
    const handleOpenArchiveConfirm = useCallback(
        (project: Project) => {
            setProjectToConfirm(project);
            setConfirmAction("archive");
            setOpenConfirmModal(true);
        },
        [],
    );

    // Confirmação de restauração
    const handleOpenRestoreConfirm = useCallback(
        (project: Project) => {
            setProjectToConfirm(project);
            setConfirmAction("restore");
            setOpenConfirmModal(true);
        },
        [],
    );

    const handleCloseConfirmModal = useCallback(() => {
        setOpenConfirmModal(false);
        setProjectToConfirm(null);
        setConfirmAction(null);
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchTerm("");
        setActiveTab("active");
    }, []);

    return {
        state: {
            searchTerm,
            activeTab,
            openModal,
            modalMode,
            selectedProject,
            openConfirmModal,
            confirmAction,
            projectToConfirm,
        },

        actions: {
            handleSearchChange,
            handleTabChange,
            handleOpenCreateModal,
            handleOpenEditModal,
            handleOpenViewModal,
            handleCloseModal,
            handleOpenArchiveConfirm,
            handleOpenRestoreConfirm,
            handleCloseConfirmModal,
            handleClearFilters,
        },
    };
};
