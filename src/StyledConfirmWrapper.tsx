import { createConfirmation } from "react-confirm";

import StyledConfirmDialog, {
  StyledConfirmDialogProps,
} from "./StyledConfirmDialog";

const confirmDialog = createConfirmation(StyledConfirmDialog);

export function confirmMUI(
  message: string,
  options: Partial<Omit<StyledConfirmDialogProps, "text">> = {},
) {
  return confirmDialog({
    message,
    accept: options.accept ?? "Continue",
  });
}
