import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";


export type TableColumn<T> = {
  key: keyof T | "actions";
  label: string;
  render?: (row: T) => ReactNode;
};
type TableComponentProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  page: number;
  rowsPerPage: number;
  total: number;
  onRowClick: (row: T) => void;
  getRowId: (row: T) => React.Key;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
};

export function TableComponent<T>({
  data,
  columns,
  page,
  rowsPerPage,
  total,
  getRowId,
  onRowClick,
  onPageChange,
  onRowsPerPageChange,
}: TableComponentProps<T>) {
  const handleChangePage = (
    _: unknown,
    newPage: number,
  ) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onRowsPerPageChange(Number(event.target.value));
    onPageChange(0);
  };
  const clickable = Boolean(onRowClick);
  return (
    <Paper>
      <TableContainer>
        <MuiTable>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography
                    variant="body1"
                    color="text.secondary"
                  >
                    Não há dados para serem visualizados!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  hover
                  sx={{
                    cursor: clickable ? 'pointer' : 'auto'
                  }}
                  onClick={clickable ? () => onRowClick?.(row) : undefined}
                >
                  {columns.map((column) => {
                    const value =
                      column.key === "actions"
                        ? undefined
                        : row[column.key];
                    return (
                      <TableCell
                        key={String(column.key)}
                      >
                        {column.render
                          ? column.render(row)
                          : String(value ?? "-")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Itens por página:"
      />
    </Paper>
  );
}