
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type BreadcrumbItem = {
    label: string;
    to?: string;
}


type BreadcrumbComponentProps = {
    items: BreadcrumbItem[];
}


export const BreadcrumbComponent = ({ items }: BreadcrumbComponentProps) => {
    return (
        <Breadcrumbs
            aria-label="Navegação estrutural"
            separator="/"
            sx={{
                mb: 2,
                color: "text.secondary",
                fontSize: "0.875rem",
            }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (item.to && !isLast) {
                    return (
                        <Link
                            key={`${item.label}-${index}`}
                            component={RouterLink}
                            to={item.to}
                            underline="hover"
                            color="inherit"
                        >
                            {item.label}
                        </Link>
                    );
                }

                return (
                    <Typography
                        key={`${item.label}-${index}`}
                        component="span"
                        color="inherit"
                        sx={{ fontSize: "inherit" }}
                        aria-current={isLast ? "page" : undefined}
                    >
                        {item.label}
                    </Typography>
                );
            })}
        </Breadcrumbs>
    );
}