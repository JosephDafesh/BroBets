import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Card, CardContent, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Paper, Chip } from '@mui/material';

export default function AdminEvent({ event_id }) {
  const [newBetPrompt, setNewBetPrompt] = useState('');
  const [newBetType, setNewBetType] = useState(null);
  const [newBetPoints, setNewBetPoints] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState({});

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
    fetch(`/get-questionnaire/${event_id}`)
    // fetch(`/event/get-questionnaire/6`) // hard coded event_id
      .then(response => response.json())
      .then(data => {
        console.log('data in get questionnaire in addbets:', data);
        setQuestions(data);
        let initialCorrectAnswers = {};
        if(data.length){
          data.forEach(question => {
            // what are we doing here
            initialCorrectAnswers[question.bet_id] = '';
          });
        }
        setCorrectAnswers(initialCorrectAnswers);
      })
      .catch(error => console.error("Couldn't fetch questions:", error));
  }, [event_id]);

  const updateNewBetPrompt = (e) => {
    setNewBetPrompt(e.target.value);
    console.log('newBetPrompt:', e.target.value)
  };

  const updateNewBetPoints = (e) => {
    setNewBetPoints(e.target.value);
    console.log('newBetPoints:', e.target.value)
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
        points: newBetPoints
      }),
    })
    const newBet = await addBetRes.json();
    console.log('newBetData:', newBet);
    setQuestions(prev => [...prev, ...newBet]);
    console.log('questions:', questions);
  };

  const handleAnswerChange = (betId, answer) => {
    setCorrectAnswers(prev => ({ ...prev, [betId]: answer }));
  };

  const handleSubmitCorrectAnswers = () => {
    fetch('/update-correct-answer', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_id, correctAnswers }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit correct answers');
      }
      alert('Correct answers submitted successfully');
    })
    .catch(error => console.error('Error submitting correct answers:', error));
  };

    const renderQuestion = (question, i) => {
      return (
        <Paper key={i} elevation={3} sx={{ marginBottom: 2, width: '60vw', marginLeft: 'auto', marginRight: 'auto' }}>
          <Card>
            <CardContent>
              <Typography variant="h6">{question.question}</Typography>
              {question.type === 'true_false' ? (
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Correct Answer"
                    value={correctAnswers[question.bet_id] || ''}
                    onChange={(e) => handleAnswerChange(question.bet_id, e.target.value)}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="True" />
                    <FormControlLabel value="false" control={<Radio />} label="False" />
                  </RadioGroup>
                </FormControl>
              ) : (
                <TextField
                  margin="dense"
                  id={`correct-answer-${question.bet_id}`}
                  label="Correct Answer"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={correctAnswers[question.bet_id] || ''}
                  onChange={(e) => handleAnswerChange(question.bet_id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        </Paper>
      )};

  return (
    <div>
      <Box>
        <Typography variant="h5">
                Add Bets!
            </Typography>
            <Chip label="true or false" 
            color={newBetType === 'true_false' ? 'primary' : 'default'} 
            onClick={() => setNewBetType(newBetType === null ? 'true_false' : null)} />
            <Chip label="Player Input" 
            color={newBetType === 'player_input' ? 'primary' : 'default'} 
            onClick={() => setNewBetType(newBetType === null ? 'player_input' : null)}/>
        </Box>
        <FormControl>
        {newBetType !== null && 
            <Box>
                <TextField label="Question" 
                onChange={updateNewBetPrompt}
                />
                <TextField label="Points" 
                type="number"
                value={newBetPoints} 
                onChange={updateNewBetPoints}
                />
                <Button onClick={handleAddBet} 
                variant="contained" 
                color="success" >
                    Add Bet
                </Button>
            </Box>
      }
      </FormControl>
    <Box>
      {questions.map((question, i) => renderQuestion(question, i))}
      <Button variant="contained" color="success" onClick={handleSubmitCorrectAnswers} sx={{ marginTop: 2 }}>
        Submit Correct Answers
      </Button>
    </Box>
    </div>
  );
};