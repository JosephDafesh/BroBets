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

  const setEvent_id = useStore((state) => state.setEvent_id);
  const setNickname = useStore((state) => state.setNickname);

  function handleJoinGame() {
    setEvent_id(eventIdInput);
    setNickname(nicknameInput);
    navigate('/questionnaire');
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
          }}
          spacing={2}
          noValidate
          autoComplete='off'
        >
          <div align='center'>Enter Event Id</div>
          <TextField
            hiddenLabel
            value={eventIdInput}
            variant='filled'
            size='small'
            onChange={(e) => setEventIdInput(e.target.value)}
          />
          <div align='center'>Enter Nickname</div>
          <TextField
            hiddenLabel
            value={nicknameInput}
            variant='filled'
            onChange={(e) => setNicknameInput(e.target.value)}
            size='small'
          />
          <Button color='success' variant='contained' onClick={handleJoinGame}>
            Join
          </Button>
        </Stack>
      </Popover>
    </>
  );
}
