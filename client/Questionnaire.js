import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function Questionnaire({ event_Id }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { betId: answer }

  useEffect(() => {
    fetch(`/get-questionnaire/${event_Id}`)
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
  }, [event_Id]);

  const handleChange = (betId, answer) => {
    setAnswers(prev => ({ ...prev, [betId]: answer }));
  };

  const handleSubmit = () => {
    fetch('/post-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_Id, nickname, event_Id, answers: Object.entries(answers).map(([betId, answer]) => ({ bet_id: betId, answer })) }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
      alert('Answers submitted successfully');
    })
    .catch(error => console.error('Error submitting answers:', error));
  };

  return (
    <Dialog open={true} onClose={() => {}} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Submit Your Answers</DialogTitle>
      <DialogContent>
        {questions.map(question => (
          <TextField
            key={question.bet_id}
            margin="dense"
            id={`answer-${question.bet_id}`}
            label={question.question}
            type="text"
            fullWidth
            variant="standard"
            value={answers[question.bet_id]}
            onChange={(e) => handleChange(question.bet_id, e.target.value)}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Submit Answers
        </Button>
      </DialogActions>
    </Dialog>
  );
}