import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));

export default function JoinGame() {
  return (
    <Stack
      component="form"
      sx={{
        width: "25ch",
      }}
      spacing={2}
      noValidate
      autoComplete="off"
    >
      <div align="center">Join a game</div>
      <div align="center">Enter Room Code</div>
      <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        defaultValue=""
        variant="filled"
        size="small"
      />
      <div align="center">Enter Nickname</div>
      <TextField
        hiddenLabel
        id="filled-hidden-label-normal"
        defaultValue=""
        variant="filled"
      />
    </Stack>
  );
}
