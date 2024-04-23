import {
  DesktopWindowsSharp,
  EditSharp,
  LibraryAddSharp,
  LockOutlined,
  TerrainSharp,
} from "@mui/icons-material";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";

export function Header() {
  return (
    <Stack direction="row">
      <IconButton>
        <TerrainSharp />
      </IconButton>
      <Typography variant="h1">Virtual Field Guides</Typography>
      <Stack direction="row">
        <IconButton>
          <DesktopWindowsSharp />
        </IconButton>
        <IconButton>
          <LibraryAddSharp />
        </IconButton>
        <IconButton>
          <EditSharp />
        </IconButton>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
      </Stack>
    </Stack>
  );
}
