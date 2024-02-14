import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';

export default function AdminEvent({ eventId }) {
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
    fetch(`/get-questionnaire/${eventId}`)
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questionnaire);
        let initialCorrectAnswers = {};
        data.questionnaire.forEach(question => {
          initialCorrectAnswers[question.bet_id] = '';
        });
        setCorrectAnswers(initialCorrectAnswers);
      })
      .catch(error => console.error("Couldn't fetch questions:", error));
  }, [eventId]);

  const handleAnswerChange = (betId, answer) => {
    setCorrectAnswers(prev => ({ ...prev, [betId]: answer }));
  };

  const handleSubmitCorrectAnswers = () => {
    fetch('/update-correct-answer', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId, correctAnswers }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit correct answers');
      }
      alert('Correct answers submitted successfully');
    })
    .catch(error => console.error('Error submitting correct answers:', error));
  };

  return (
    <div>
      {questions.map((question) => (
        <Paper key={question.bet_id} elevation={3} sx={{ marginBottom: 2, width: '60vw', marginLeft: 'auto', marginRight: 'auto' }}>
          <Card>
            <CardContent>
              <Typography variant="h6">{question.question}</Typography>
              {question.type === 'true_false' ? (
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="Correct Answer"
                    value={correctAnswers[question.bet_id]}
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
                  value={correctAnswers[question.bet_id]}
                  onChange={(e) => handleAnswerChange(question.bet_id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        </Paper>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmitCorrectAnswers} sx={{ marginTop: 2 }}>
        Submit Correct Answers
      </Button>
    </div>
  );
}