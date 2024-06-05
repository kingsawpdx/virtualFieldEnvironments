import { forwardRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Typography, createTheme } from "@mui/material";
import { SxProps, styled } from "@mui/material/styles";

/** Calculate a very light version of given color */
function getBGColor(color: string): string {
  const t = createTheme({
    palette: {
      primary: {
        main: color,
      },
      tonalOffset: 0.96,
    },
  });

  return t.palette.primary.light;
}

interface MuiDropzoneProps {
  label: string;
  sx?: SxProps;
  onInput: (files: File[]) => void;
}

// default styling --> overridden by sx prop
const DropzoneRoot = styled("div", {
  name: "MuiDropzone", // The component name
  slot: "root", // The slot name
})(({ theme }) => ({
  backgroundColor: getBGColor(theme.palette.primary.light),
  padding: "16.5px 14px", // default MUI input padding
  border: `2px dashed ${theme.palette.primary.dark}`,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  boxSizing: "border-box",
}));

const DropzoneInput = styled("input", {
  name: "MuiDropzone",
  slot: "input",
})(() => ({
  display: "none",
}));

export const MuiDropzone = forwardRef<HTMLDivElement, MuiDropzoneProps>(
  function MuiDropzone({ label, sx, onInput }: MuiDropzoneProps, ref) {
    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        onInput(acceptedFiles);
      },
      [onInput],
    );

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: { "application/whatever": [".vfe"] },
    });

    return (
      <DropzoneRoot sx={sx} ref={ref} {...getRootProps()}>
        <DropzoneInput {...getInputProps()} />
        <Typography sx={{ margin: "0 auto" }}>{label}</Typography>
      </DropzoneRoot>
    );
  },
);

export default MuiDropzone;
