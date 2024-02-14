import React, { useState, useEffect } from 'react';
import {
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
} from '@mui/material';
import { useStore } from './store';
import { useNavigate } from 'react-router-dom';

export default function Questionnaire() {
  const initialNickname = useStore((state) => state.nickname);
  const { event_id, user_id } = useStore.getState();
  console.log('event_id is', event_id);
  const [questions, setQuestions] = useState([]); // State to hold the questions
  const [answers, setAnswers] = useState({}); // { betId: answer }
  const [nickname, setNickname] = useState(initialNickname); // State to hold the nickname
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  console.log('questions are', questions);
  const navigate = useNavigate();
  const setEvent_id = useStore((state) => state.setEvent_id);
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);

  // Fetch the questions for the event
  useEffect(() => {
    const fetchData = async () => {
      const titleCreatorRes = await fetch(
        `/event/title-and-creator/${event_id}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (titleCreatorRes.ok) {
        const data = await titleCreatorRes.json();
        setTitle(data.title);
        setCreator(data.creator);
        const questionnaireRes = await fetch(
          `/event/get-questionnaire/${event_id}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (questionnaireRes.ok) {
          const q = await questionnaireRes.json();
          console.log(q);
          setQuestions(q);
        } else {
          console.log('Failed to get Questionnaire');
        }
      } else {
        console.log('Faied to get title and creator');
      }
    };
    fetchData();
  }, [event_id]);

  // Update the answers state when the user types in the answers
  const handleChange = (betId, answer) => {
    setAnswers((prev) => ({ ...prev, [betId]: answer }));
  };

  // Update the nickname state when the user types in the nickname
  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  // Submit the answers
  const handleSubmit = () => {
    fetch('event/post-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        nickname,
        event_id,
        answers: Object.entries(answers).map(([betId, answer]) => ({
          bet_id: betId,
          answer,
        })),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit answers');
        }
        setSnackbarMessage({
          severity: 'success',
          message: 'submitted your answers successfully',
        });
        setEvent_id(null);
        setNickname('');
        navigate('/dashboard');
      })
      .catch((error) =>
        setSnackbarMessage({
          severity: 'error',
          message: 'submitted your answers failed' + error,
        })
      );
  };

  const cardStyle = {
    marginBottom: 2,
    width: '60vw',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <Typography>Event Name: {title}</Typography>
      <Typography>Creator: {creator}</Typography>
      <TextField
        margin='dense'
        id='nickname'
        label='Nickname'
        type='text'
        fullWidth
        variant='outlined'
        value={nickname}
        onChange={handleNicknameChange}
        sx={{ marginBottom: 2 }}
      />
      {questions.map((question) => (
        <Paper key={question.bet_id} elevation={3} sx={cardStyle}>
          <Card key={question.bet_id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant='h6'>{question.question}</Typography>
              {question.type === 'true_false' ? (
                <FormControl>
                  <RadioGroup
                    aria-label={question.question}
                    name={question.bet_id}
                    value={answers[question.bet_id]}
                    onChange={(e) =>
                      handleChange(question.bet_id, e.target.value)
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
                  id={`answer-${question.bet_id}`}
                  label='Your Answer'
                  type='text'
                  fullWidth
                  variant='outlined'
                  value={answers[question.bet_id]}
                  onChange={(e) =>
                    handleChange(question.bet_id, e.target.value)
                  }
                />
              )}
            </CardContent>
          </Card>
        </Paper>
      ))}
      <Button
        variant='contained'
        color='primary'
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        Submit Answers
      </Button>
    </div>
  );
}
