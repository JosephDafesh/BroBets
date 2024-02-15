import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { useStore } from './store';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  flexGrow: 1,
}));

export default function JoinGame() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [nicknameInput, setNicknameInput] = useState('');
  const [eventIdInput, setEventIdInput] = useState('');
  const navigate = useNavigate();

  const { user_id } = useStore.getState();
  const setEvent_id = useStore((state) => state.setEvent_id);
  const setNickname = useStore((state) => state.setNickname);
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);

  async function handleJoinGame() {
    const response = await fetch(`/event/join-game/${user_id}/${eventIdInput}`);
    if (response.ok) {
      setEvent_id(eventIdInput);
      setNickname(nicknameInput);
      navigate('/questionnaire');
      setSnackbarMessage({
        severity: 'success',
        message: 'Joined game successfully',
      });
    } else {
      setSnackbarMessage({
        severity: 'error',
        message: 'You have already joined the game',
      });
    }
  }
  return (
    <>
      <Button
        sx={{ color: 'black' }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Join Game
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Stack
          component='form'
          sx={{
            width: '25ch',
            backgroundColor: '#ffd7c1',
          }}
          spacing={2}
          noValidate
          autoComplete='off'
        >
          <Typography align='center' >Enter Event Id</Typography>
          <TextField
            hiddenLabel
            value={eventIdInput}
            variant='filled'
            size='small'
            onChange={(e) => setEventIdInput(e.target.value)}
          />
          <Typography align='center'>Enter Nickname</Typography>
          <TextField
            hiddenLabel
            value={nicknameInput}
            variant='filled'
            onChange={(e) => setNicknameInput(e.target.value)}
            size='small'
          />
          <Button color='primary' variant='contained' onClick={handleJoinGame}>
            Join
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
