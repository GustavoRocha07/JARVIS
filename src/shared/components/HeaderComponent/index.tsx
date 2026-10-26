import { Box, Typography, type TypographyProps } from "@mui/material";
import type { ReactNode } from "react";
import { ButtonComponent } from "../ButtonComponent";

type HeaderComponentProps = {
  title: string;
  variant?: TypographyProps["variant"];
  subtitle?: string;
  hasButton?: boolean;
  buttonText?: string;
  buttonIcon?: ReactNode;
  action?: () => void;
};

export const HeaderComponent = ({
  title,
  subtitle,
  buttonIcon,
  variant,
  buttonText,
  hasButton,
  action,
}: HeaderComponentProps): React.JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        alignItems: {
          xs: "stretch",
          sm: "center",
        },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant={variant}
          sx={{
            fontWeight: "bolder",
           
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="h6"
            sx={{
              mt: 0.25,
              fontWeight: "normal",
              fontStyle: "italic",
              fontSize: {
                xs: "0.95rem",
                sm: "1.05rem",
                md: "1.25rem",
              },
              color: "text.secondary",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {hasButton && (
        <Box
          sx={{
            flexShrink: 0,
            alignSelf: {
              xs: "stretch",
              sm: "center",
            },
            "& button": {
              width: {
                xs: "100%",
                sm: "auto",
              },
            },
          }}
        >
          <ButtonComponent
            variant="contained"
            text={buttonText || ""}
            buttonIcon={buttonIcon}
            onClick={action}
          />
        </Box>
      )}
    </Box>
  );
};
