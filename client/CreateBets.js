import React, { useState } from 'react';
import {
  FormControl,
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { useStore } from './store';
import { useNavigate } from 'react-router-dom';

export default function CreateBets() {
  const [bets, setBets] = useState([]);
  const { event_id } = useStore.getState();
  const [newBetPrompt, setNewBetPrompt] = useState('');
  const [newBetType, setNewBetType] = useState(null);
  const [newBetPoints, setNewBetPoints] = useState(1);
  const navigate = useNavigate();

  const handleAddBet = async () => {
    const newBet = {
      type: newBetType,
      question: newBetPrompt,
      points: newBetPoints,
    };
    const addBetRes = await fetch(`/event/new-bet/${event_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBet),
    });
    if (addBetRes.ok) {
      const b = await addBetRes.json();
      setBets([...bets, b]);
    }
  };

  return (
    <Stack sx={{ marginTop: '100px' }}>
      <FormControl>
        <Box>
          <Typography variant='h5'>Add Bets!</Typography>
          <Typography variant='h6'>
            Current Total Points:{' '}
            {bets.map((b) => Number(b.points)).reduce((a, b) => a + b, 0)}
          </Typography>
          {bets.map((b) => (
            <Stack direction='row' key={b.bet_id} gap={2}>
              <Typography>Question: {b.question}</Typography>
              <Typography>Type: {b.type}</Typography>
              <Typography>Points: {b.points}</Typography>
              {/* <Button>Delete</Button> */}
            </Stack>
          ))}
          <Chip label='Yes or No' onClick={() => setNewBetType('true_false')} />
          <Chip
            label='Player Input'
            onClick={() => setNewBetType('Player Input')}
          />
        </Box>
        {newBetType !== null && (
          <Box>
            <TextField
              label='Question'
              onChange={(e) => setNewBetPrompt(e.target.value)}
              value={newBetPrompt}
            />
            <TextField
              label='Points'
              type='number'
              value={newBetPoints}
              onChange={(e) => setNewBetPoints(e.target.value)}
            />
            <Button onClick={handleAddBet} variant='contained' color='success'>
              Add Bet
            </Button>
          </Box>
        )}
        <Button
          variant='contained'
          color='success'
          onClick={() => navigate('/questionnaire')}
        >
          Finish!
        </Button>
      </FormControl>
    </Stack>
  );
}
