import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Chip,
} from '@mui/material';
import { useStore } from './store';

export default function AdminEvent() {
  const [newBetPrompt, setNewBetPrompt] = useState('');
  const [newBetType, setNewBetType] = useState(null);
  const [newBetPoints, setNewBetPoints] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});
  const { event_id } = useStore.getState();
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);

  //   const [questions, setQuestions] = useState([
  //     { bet_id: '1', question: 'Is React a library for frontend development?', type: 'true_false' },
  //     { bet_id: '2', question: 'What is the capital of France?', type: 'user_input' },
  //     { bet_id: '3', question: 'Does JavaScript support functional programming?', type: 'true_false' },
  //   ]);
  //   const [correctAnswers, setCorrectAnswers] = useState({
  //     '1': '', // Initialize with empty answers
  //     '2': '',
  //     '3': '',
  //   });

  //     useEffect(() => {
  //     // Simulate fetching data
  //     let initialCorrectAnswers = {};
  //     questions.forEach(question => {
  //       initialCorrectAnswers[question.bet_id] = ''; // Initialize answers
  //     });
  //     setCorrectAnswers(initialCorrectAnswers);
  //   }, [questions]); // Dependency on questions to simulate effect

  //   const handleAnswerChange = (betId, answer) => {
  //     setCorrectAnswers(prev => ({ ...prev, [betId]: answer }));
  //   };

  //   const handleSubmitCorrectAnswers = () => {
  //     // Here you would handle submitting the answers
  //     console.log('Submitting correct answers:', correctAnswers);
  //     alert('Correct answers submitted successfully (simulated)');
  //   };

  useEffect(() => {
    fetch(`event/get-questionnaire/${event_id}`)
      // fetch(`/event/get-questionnaire/6`) // hard coded event_id
      .then((response) => response.json())
      .then((data) => {
        console.log('data in get questionnaire in addbets:', data);
        setQuestions(data);
        let initialCorrectAnswers = {};
        if (data.length) {
          data.forEach((question) => {
            // what are we doing here
            initialCorrectAnswers[question.bet_id] = '';
          });
        }
        setCorrectAnswers(initialCorrectAnswers);
      })
      .catch((error) =>
        setSnackbarMessage({
          severity: 'error',
          message: 'Getting questionnaire failed: ' + error,
        })
      );
  }, [event_id]);

  const updateNewBetPrompt = (e) => {
    setNewBetPrompt(e.target.value);
    console.log('newBetPrompt:', e.target.value);
  };

  const updateNewBetPoints = (e) => {
    setNewBetPoints(e.target.value);
    console.log('newBetPoints:', e.target.value);
  };

  const handleAddBet = async () => {
    const addBetRes = await fetch(`/event/new-bet/${event_id}`, {
      // const addBetRes = await fetch(`/event/new-bet/6`, { // hard coded event_id
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: newBetType,
        question: newBetPrompt,
        points: newBetPoints,
      }),
    });
    if (addBetRes.ok) {
      const newBet = await addBetRes.json();
      setQuestions((prev) => [...prev, ...newBet]);
      setSnackbarMessage({
        severity: 'success',
        message: 'added bet successfully',
      });
    } else {
      setSnackbarMessage({
        severity: 'error',
        message: 'Adding bet failed',
      });
    }
  };

  const handleAnswerChange = (betId, answer) => {
    setCorrectAnswers((prev) => ({ ...prev, [betId]: answer }));
  };

  const handleSubmitCorrectAnswers = () => {
    fetch('/update-correct-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id, correctAnswers }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit correct answers');
        }
        alert('Correct answers submitted successfully');
      })
      .catch((error) =>
        setSnackbarMessage({
          severity: 'error',
          message: 'Error submitting correct answers:',
          error,
        })
      );
  };

  const renderQuestion = (question, i) => {
    return (
      <Paper
        key={i}
        elevation={3}
        sx={{
          marginBottom: 2,
          width: '60vw',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '100px',
        }}
      >
        <Card>
          <CardContent>
            <Typography variant='h6'>{question.question}</Typography>
            {question.type === 'true_false' ? (
              <FormControl component='fieldset'>
                <RadioGroup
                  aria-label='Correct Answer'
                  value={correctAnswers[question.bet_id] || ''}
                  onChange={(e) =>
                    handleAnswerChange(question.bet_id, e.target.value)
                  }
                >
                  <FormControlLabel
                    value='true'
                    control={<Radio />}
                    label='True'
                  />
                  <FormControlLabel
                    value='false'
                    control={<Radio />}
                    label='False'
                  />
                </RadioGroup>
              </FormControl>
            ) : (
              <TextField
                margin='dense'
                id={`correct-answer-${question.bet_id}`}
                label='Correct Answer'
                type='text'
                fullWidth
                variant='outlined'
                value={correctAnswers[question.bet_id] || ''}
                onChange={(e) =>
                  handleAnswerChange(question.bet_id, e.target.value)
                }
              />
            )}
          </CardContent>
        </Card>
      </Paper>
    );
  };

  return (
    <div>
      <Box sx={{ marginTop: '100px' }}>
        <Typography variant='h5'>Add Bets!</Typography>
        <Chip
          label='true or false'
          color={newBetType === 'true_false' ? 'secondary' : 'default'}
          onClick={() =>
            setNewBetType('true_false')
          }
        />
        <Chip
          label='Player Input'
          color={newBetType === 'player_input' ? 'secondary' : 'default'}
          onClick={() =>
            setNewBetType('player_input')
          }
        />
      </Box>
      <FormControl>
        {newBetType !== null && (
          <Box>
            <TextField label='Question' onChange={updateNewBetPrompt} />
            <TextField
              label='Points'
              type='number'
              value={newBetPoints}
              onChange={updateNewBetPoints}
            />
            <Button onClick={handleAddBet} variant='contained' color='primary'>
              Add Bet
            </Button>
          </Box>
        )}
      </FormControl>
      <Box>
        {questions.map((question, i) => renderQuestion(question, i))}
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmitCorrectAnswers}
          sx={{ marginTop: 2 }}
        >
          Submit Correct Answers
        </Button>
      </Box>
    </div>
  );
}
