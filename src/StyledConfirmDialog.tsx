import { ThemeProvider } from "@emotion/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ConfirmDialogProps, confirmable } from "react-confirm";

import { theme } from "./main";

export interface StyledConfirmDialogProps {
  message: string;
  accept: string;
  details?: string;
}

function StyledConfirm({
  show,
  proceed,
  message,
  details,
  accept,
}: ConfirmDialogProps<StyledConfirmDialogProps, boolean>) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={show}
        onClose={() => {
          proceed(false);
        }}
      >
        <DialogTitle>{message}</DialogTitle>
        {details && <DialogContent>{details}</DialogContent>}
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              proceed(false);
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              proceed(true);
            }}
            color={
              accept === "Delete" || accept === "Remove" ? "error" : "primary"
            }
          >
            {accept}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

const StyledConfirmDialog = confirmable(StyledConfirm);
export default StyledConfirmDialog;
