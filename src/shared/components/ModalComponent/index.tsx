import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import type { ReactNode } from "react"

interface ModalComponentProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  actions?: ReactNode
  fullWidth?: boolean
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}

export const ModalComponent = ({
  open,
  onClose,
  title,
  children,
  actions,
  fullWidth = true,
  maxWidth = "sm",
}: ModalComponentProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth}>
      {/* Cabeçalho */}
      <DialogTitle sx={{ m: 0, p: 2, pr: 6, fontWeight: 600 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />


      <DialogContent sx={{ p: 3, pt: 3 }}>
        {children}
      </DialogContent>

      {actions && (
        <>
          <Divider />

          <DialogActions sx={{ p: 2, px: 3 }}>
            {actions}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}