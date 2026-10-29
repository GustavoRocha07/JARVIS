
import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputAdornment,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";

import { HeaderComponent } from "@/shared/components/HeaderComponent";

import { useProjectsComponent } from "../hooks/useProjectsComponent";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";

import type { ProjectFormValues } from "../types/projects.types";
import type { ProjectTab } from "../hooks/useProjectsUI";
import { AddOutlined, Search } from "@mui/icons-material";

export const ProjectsPage = () => {
    const { state, actions } = useProjectsComponent();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: ProjectFormValues) => {
        setError(null);

        try {
            if (state.modalMode === "create") {
                await actions.handleCreateProject(values);
                return;
            }

            if (
                state.modalMode === "edit" &&
                state.selectedProject
            ) {
                await actions.handleUpdateProject(
                    state.selectedProject.id,
                    values,
                );
            }
        } catch {
            setError("Não foi possível salvar o projeto.");
        }
    };

    const handleConfirm = async () => {
        setError(null);

        try {
            await actions.handleConfirmAction();
        } catch {
            setError("Não foi possível concluir a operação.");
        }
    };

    return (
        <Box>
            <HeaderComponent
                title="Meus Projetos"
                variant="h4"
                subtitle="Organize suas tarefas por projetos"
                buttonIcon={<AddOutlined />}
                hasButton
                action={actions.handleOpenCreateModal}
                buttonText="Novo Projeto"
            />

            <Stack spacing={3} sx={{
                mt: 3
            }}>
                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        alignContent: 'center'
                    }}
                >
                    <TextField

                        placeholder="Buscar projetos..."
                        size="small"
                        value={state.searchTerm}
                        onChange={(event) =>
                            actions.handleSearchChange(event.target.value)
                        }
                        sx={{ maxWidth: '50%', flexGrow: 1 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Tabs
                        value={state.activeTab}
                        onChange={(_, value: ProjectTab) =>
                            actions.handleTabChange(value)
                        }

                        sx={(theme) => ({
                            minHeight: 36,

                            padding: '3px',
                            borderRadius: '8px',
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundColor: theme.palette.background.paper,

                            '& .MuiTab-root': {
                                minHeight: 40,
                                minWidth: 100,
                                padding: '6px 16px',
                                borderRadius: '6px',
                                textTransform: 'none',
                                fontSize: '12px',
                                color: theme.palette.text.secondary,
                                transition: 'all 0.2s ease',

                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,

                                },

                                '&:hover:not(.Mui-selected)': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            },
                        })}
                    >
                        <Tab
                            value="active"
                            label={`Ativos (${state.projectCounts.active})`}
                        />

                        <Tab
                            value="archived"
                            label={`Arquivados (${state.projectCounts.archived})`}
                        />
                    </Tabs>

                </Box>

                {state.hasProjects ? (
                    <Grid container spacing={3}>
                        {state.projects.map((project) => (
                            <Grid key={project.id} size={{ xs: 12, md: 6, lg: 4 }}>
                                <ProjectCard
                                    project={project}
                                    onEdit={actions.handleOpenEditModal}
                                    onView={actions.handleOpenViewModal}
                                    onArchive={actions.handleOpenArchiveConfirm}
                                    onRestore={actions.handleOpenRestoreConfirm}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{
                        textAlign: "center", py: 8
                    }}>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                        >
                            Nenhum projeto encontrado
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 1
                            }}
                        >
                            {state.searchTerm
                                ? "Tente alterar sua busca."
                                : "Você ainda não possui projetos nesta aba."}
                        </Typography>
                    </Box>
                )}
            </Stack>

            <ProjectModal
                open={state.openModal}
                mode={state.modalMode}
                project={state.selectedProject}
                onClose={actions.handleCloseModal}
                onSubmit={handleSubmit}
            />

            <Dialog
                open={state.openConfirmModal}
                onClose={actions.handleCloseConfirmModal}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    {state.confirmAction === "archive"
                        ? "Arquivar projeto"
                        : "Restaurar projeto"}
                </DialogTitle>

                <DialogContent>
                    <Typography>
                        {state.confirmAction === "archive"
                            ? `Deseja arquivar "${state.projectToConfirm?.name}"?`
                            : `Deseja restaurar "${state.projectToConfirm?.name}"?`}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={actions.handleCloseConfirmModal}>
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        color={
                            state.confirmAction === "archive"
                                ? "warning"
                                : "success"
                        }
                        onClick={handleConfirm}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
