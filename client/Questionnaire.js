import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';

export default function Questionnaire({ eventId, userId }) {
  const [questions, setQuestions] = useState([]); // State to hold the questions
  const [answers, setAnswers] = useState({}); // { betId: answer }
  const [nickname, setNickname] = useState(''); // State to hold the nickname

// Fetch the questions for the event
  useEffect(() => {
    fetch(`/get-questionnaire/${eventId}`)
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questionnaire);
        let initialAnswers = {};
        data.questionnaire.forEach(question => {
          initialAnswers[question.bet_id] = '';
        });
        setAnswers(initialAnswers);
      })
      .catch(error => console.error("Couldn't fetch questions:", error));
  }, [eventId]);

// Update the answers state when the user types in the answers
  const handleChange = (betId, answer) => {
    setAnswers(prev => ({ ...prev, [betId]: answer }));
  };

// Update the nickname state when the user types in the nickname
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

// Submit the answers
  const handleSubmit = () => {
    fetch('/post-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, nickname, event_id: eventId, answers: Object.entries(answers).map(([betId, answer]) => ({ bet_id: betId, answer })) }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
      alert('Answers submitted successfully');
    })
    .catch(error => console.error('Error submitting answers:', error));
  };

  const cardStyle = {
    marginBottom: 2,
    width: '60vw', 
    marginLeft: 'auto',
    marginRight: 'auto',
  };


  return (
    <div>
      <TextField
        margin="dense"
        id="nickname"
        label="Nickname"
        type="text"
        fullWidth
        variant="outlined"
        value={nickname}
        onChange={handleNicknameChange}
        sx={{ marginBottom: 2 }}
      />
      {questions.map(question => (
         <Paper key={question.bet_id} elevation={3} sx={cardStyle}>
        <Card key={question.bet_id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{question.question}</Typography>
            {question.type === 'true_false' ? (
              <FormControl>
                <RadioGroup
                  aria-label={question.question}
                  name={question.bet_id}
                  value={answers[question.bet_id]}
                  onChange={(e) => handleChange(question.bet_id, e.target.value)}
                >
                  <FormControlLabel value="true" control={<Radio />} label="True" />
                  <FormControlLabel value="false" control={<Radio />} label="False" />
                </RadioGroup>
              </FormControl>
            ) : (
              <TextField
                margin="dense"
                id={`answer-${question.bet_id}`}
                label="Your Answer"
                type="text"
                fullWidth
                variant="outlined"
                value={answers[question.bet_id]}
                onChange={(e) => handleChange(question.bet_id, e.target.value)}
              />
            )}
          </CardContent>
        </Card>
        </Paper>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
        Submit Answers
      </Button>
    </div>
  );
}