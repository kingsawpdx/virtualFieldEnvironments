import { ThemeProvider } from "@emotion/react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { ConfirmDialogProps, confirmable } from "react-confirm";

import { theme } from "./main";

export interface StyledConfirmDialogProps {
  message: string;
  accept: string;
}

function StyledConfirm({
  show,
  proceed,
  message,
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
        <DialogActions>
          <Button
            onClick={() => {
              proceed(false);
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              proceed(true);
            }}
            color={accept === "Delete" ? "error" : "primary"}
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
