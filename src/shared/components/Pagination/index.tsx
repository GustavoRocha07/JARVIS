import { Box, Pagination } from "@mui/material";

interface PaginationComponentProps {
    page: number;
    count: number;
    rowsPerPage: number;

    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;

    rowsPerPageOptions?: number[];
}

export const PaginationComponent = ({
    page,
    count,
    onPageChange,
}: PaginationComponentProps) => {

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                marginTop: 2,
            }}>

            <Pagination
                page={page}
                count={count}
                shape="rounded"
                variant="outlined"
                onChange={(_, newPage) => {
                    onPageChange(newPage);
                }}
            />
        </Box>
    )

}