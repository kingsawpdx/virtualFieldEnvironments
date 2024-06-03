import { ThemeProvider } from "@emotion/react";
import { ConfirmDialogProps, confirmable } from "react-confirm";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { theme } from "./main";

export interface StyledAcceptDialogProps {
  message: string;
  accept?: string;
  details?: string;
}

function StyledAlert({
  show,
  proceed,
  message,
  accept,
  details,
}: ConfirmDialogProps<StyledAcceptDialogProps, void>) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={show}
        onClose={() => {
          proceed();
        }}
      >
        <DialogTitle>{message}</DialogTitle>
        {details && (
          <DialogContent>
            <Typography>{details}</Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              proceed();
            }}
          >
            {accept ?? "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export interface StyledConfirmDialogProps {
  message: string;
  accept?: string;
  details?: string;
}

function StyledConfirm({
  show,
  proceed,
  message,
  accept,
  details,
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
        {details && (
          <DialogContent>
            <Typography>{details}</Typography>
          </DialogContent>
        )}
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
            {accept ?? "Continue"}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export const StyledAlertDialog = confirmable(StyledAlert);
export const StyledConfirmDialog = confirmable(StyledConfirm);
