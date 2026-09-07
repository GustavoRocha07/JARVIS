import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
} from "@mui/material";

import type {
  TaskDueFilter,
  TaskPriorityFilter,
  TaskSort,
  TaskStatusFilter,
} from "../../hooks/useTaskFilters";

type TaskFiltersProps = {
  searchTerm: string;
  statusFilter: TaskStatusFilter;
  priorityFilter: TaskPriorityFilter;
  dueFilter: TaskDueFilter;
  sort: TaskSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatusFilter) => void;
  onPriorityChange: (value: TaskPriorityFilter) => void;
  onDueChange: (value: TaskDueFilter) => void;
  onSortChange: (value: TaskSort) => void;
  onClear: () => void;
};

const selectSx = {
  height: 40,
  borderRadius: "10px",
  backgroundColor: "#fff",
  fontSize: 14,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#dce2e8",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#c9d2dc",
  },
};

export const TaskFilters = ({
  searchTerm,
  statusFilter,
  priorityFilter,
  dueFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onDueChange,
  onSortChange,
  onClear,
}: TaskFiltersProps) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.25,
      border: "1px solid #e2e8f0",
      borderRadius: "14px",
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
      backgroundColor: "#fff",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: { xs: "wrap", lg: "nowrap" },
      }}
    >
      <TextField
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        size="small"
        placeholder="Pesquisar tarefas..."
        sx={{
          flex: "1 1 320px",
          minWidth: { xs: "100%", md: 280 },
          "& .MuiOutlinedInput-root": {
            height: 40,
            borderRadius: "10px",
            backgroundColor: "#fff",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#dce2e8",
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ fontSize: 19, color: "#64748b" }} />
              </InputAdornment>
            ),
          },
          htmlInput: {
            "aria-label": "Pesquisar tarefas",
          },
        }}
      />

      <FormControl size="small" sx={{ minWidth: 142 }}>
        <Select
          value={statusFilter}
          input={<OutlinedInput />}
          onChange={(event) =>
            onStatusChange(event.target.value as TaskStatusFilter)
          }
          sx={selectSx}
        >
          <MenuItem value="ALL">Todos os status</MenuItem>
          <MenuItem value="PENDING">Pendentes</MenuItem>
          <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
          <MenuItem value="COMPLETED">Concluídas</MenuItem>
          <MenuItem value="CANCELLED">Canceladas</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 138 }}>
        <Select
          value={priorityFilter}
          input={<OutlinedInput />}
          onChange={(event) =>
            onPriorityChange(event.target.value as TaskPriorityFilter)
          }
          sx={selectSx}
        >
          <MenuItem value="ALL">Toda prioridade</MenuItem>
          <MenuItem value="LOW">Baixa</MenuItem>
          <MenuItem value="MEDIUM">Média</MenuItem>
          <MenuItem value="HIGH">Alta</MenuItem>
          <MenuItem value="URGENT">Urgente</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 138 }}>
        <Select
          value={dueFilter}
          input={<OutlinedInput />}
          onChange={(event) =>
            onDueChange(event.target.value as TaskDueFilter)
          }
          sx={selectSx}
        >
          <MenuItem value="ALL">Qualquer prazo</MenuItem>
          <MenuItem value="OVERDUE">Atrasadas</MenuItem>
          <MenuItem value="TODAY">Hoje</MenuItem>
          <MenuItem value="NEXT_7_DAYS">Próximos 7 dias</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 164 }}>
        <Select
          value={sort}
          input={<OutlinedInput />}
          onChange={(event) => onSortChange(event.target.value as TaskSort)}
          sx={selectSx}
        >
          <MenuItem value="CREATED_DESC">Ordenar: Data início</MenuItem>
          <MenuItem value="DUE_ASC">Prazo mais próximo</MenuItem>
          <MenuItem value="DUE_DESC">Prazo mais distante</MenuItem>
        </Select>
      </FormControl>

      <Button
        onClick={onClear}
        disabled={!hasActiveFilters}
        sx={{
          minWidth: 112,
          height: 40,
          textTransform: "none",
          fontSize: 14,
          fontWeight: 500,
          color: "#64748b",
          "&.Mui-disabled": {
            color: "#b8c0ca",
          },
        }}
      >
        Limpar filtros
      </Button>
    </Box>
  </Paper>
);
