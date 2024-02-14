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
  CardActions,
} from '@mui/material';
import { useStore } from './store';

const cardStyle = {
  marginBottom: 2,
  width: '60vw',
  marginLeft: 'auto',
  marginRight: 'auto',
};

export default function AdminEvent() {
  const [questions, setQuestions] = useState([]);
  const { event_id } = useStore.getState();
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);
  const [title, setTitle] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState({});
  console.log('questions', questions);

  const handleChange = (e, q) => {
    const newCorrectAnswers = { ...correctAnswers };
    newCorrectAnswers[q.bet_id] = e.target.value;
    setCorrectAnswers(newCorrectAnswers);
  };

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

  return (
    <div style={{ marginTop: '100px' }}>
      <Typography variant='h4' sx={{ width: '100%', textAlign: 'center' }}>
        Event Name: {title}
      </Typography>
      {questions.map((q) => {
        if (q.correct_answer) {
          return (
            <Paper key={q.bet_id} elevation={3} sx={cardStyle}>
              <Card key={q.bet_id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant='h6'>{q.question}</Typography>
                  <Typography variant='h6'>
                    Correct Answer: {q.correct_answer}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          );
        } else {
          return (
            <Paper key={q.bet_id} elevation={3} sx={cardStyle}>
              <Card key={q.bet_id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant='h6'>{q.question}</Typography>
                  {q.type === 'true_false' ? (
                    <FormControl>
                      <RadioGroup
                        aria-label={q.question}
                        value={correctAnswers[q.bet_id]}
                        onChange={(e) => handleChange(e, q)}
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
                      id={`answer-${q.bet_id}`}
                      label='Your Answer'
                      type='text'
                      fullWidth
                      variant='outlined'
                      value={correctAnswers[q.bet_id]}
                      onChange={(e) => handleChange(e, q)}
                    />
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    onClick={async () => {
                      const updateAnswerRes = await fetch(
                        `/event/update-correct-answer/${q.bet_id}`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            bet_id: q.bet_id,
                            correct_answer: correctAnswers[q.bet_id],
                          }),
                        }
                      );
                      if (updateAnswerRes.ok) {
                        setSnackbarMessage({
                          severity: 'success',
                          message: 'updated correct answer successfully',
                        });
                        const i = questions.findIndex(
                          (item) => item.bet_id === q.bet_id
                        );
                        const updatedQuestions = [...questions];
                        updatedQuestions[i] = {
                          ...q,
                          correct_answer: correctAnswers[q.bet_id],
                        };
                        setQuestions(updatedQuestions);
                        const newLeaderboard = await updateAnswerRes.json();
                        console.log('new leaderboard', newLeaderboard);
                        const playerRanking = [];
                        newLeaderboard.forEach(
                          (user) => (user.score = Number(user.score))
                        );
                        newLeaderboard.sort((a, b) => a.score - b.score);
                        newLeaderboard.forEach((user, i) =>
                          playerRanking.push({
                            user_id: user.user_id,
                            place: i + 1,
                          })
                        );
                        const updateRankingRes = await fetch(
                          `/event/update-ranking/${event_id}`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ playerRanking }),
                          }
                        );
                        if (!updateRankingRes.ok) {
                          setSnackbarMessage({
                            severity: 'error',
                            message: 'updated players ranking failed',
                          });
                        }
                      } else {
                        setSnackbarMessage({
                          severity: 'error',
                          message: 'updated correct answer failed',
                        });
                      }
                    }}
                  >
                    Update Correct Anser
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          );
        }
      })}
    </div>
  );

  // const renderQuestion = (question, i) => {
  //   return (
  //     <Paper
  //       key={i}
  //       elevation={3}
  //       sx={{
  //         marginBottom: 2,
  //         width: '60vw',
  //         marginLeft: 'auto',
  //         marginRight: 'auto',
  //         marginTop: '100px',
  //       }}
  //     >
  //       <Card>
  //         <CardContent>
  //           <Typography variant='h6'>{question.question}</Typography>
  //           {question.type === 'true_false' ? (
  //             <FormControl component='fieldset'>
  //               <RadioGroup
  //                 aria-label='Correct Answer'
  //                 value={correctAnswers[question.bet_id] || ''}
  //                 onChange={(e) =>
  //                   handleAnswerChange(question.bet_id, e.target.value)
  //                 }
  //               >
  //                 <FormControlLabel
  //                   value='true'
  //                   control={<Radio />}
  //                   label='True'
  //                 />
  //                 <FormControlLabel
  //                   value='false'
  //                   control={<Radio />}
  //                   label='False'
  //                 />
  //               </RadioGroup>
  //             </FormControl>
  //           ) : (
  //             <TextField
  //               margin='dense'
  //               id={`correct-answer-${question.bet_id}`}
  //               label='Correct Answer'
  //               type='text'
  //               fullWidth
  //               variant='outlined'
  //               value={correctAnswers[question.bet_id] || ''}
  //               onChange={(e) =>
  //                 handleAnswerChange(question.bet_id, e.target.value)
  //               }
  //             />
  //           )}
  //         </CardContent>
  //       </Card>
  //     </Paper>
  //   );
  // };

  // return (
  //   <div>
  //     <Box sx={{ marginTop: '100px' }}>
  //       <Typography variant='h5'>Add Bets!</Typography>
  //       <Chip
  //         label='true or false'
  //         color={newBetType === 'true_false' ? 'secondary' : 'default'}
  //         onClick={() => setNewBetType('true_false')}
  //       />
  //       <Chip
  //         label='Player Input'
  //         color={newBetType === 'player_input' ? 'secondary' : 'default'}
  //         onClick={() => setNewBetType('player_input')}
  //       />
  //     </Box>
  //     <FormControl>
  //       {newBetType !== null && (
  //         <Box>
  //           <TextField label='Question' onChange={updateNewBetPrompt} />
  //           <TextField
  //             label='Points'
  //             type='number'
  //             value={newBetPoints}
  //             onChange={updateNewBetPoints}
  //           />
  //           <Button onClick={handleAddBet} variant='contained' color='primary'>
  //             Add Bet
  //           </Button>
  //         </Box>
  //       )}
  //     </FormControl>
  //     <Box>
  //       {questions.map((question, i) => renderQuestion(question, i))}
  //       <Button
  //         variant='contained'
  //         color='primary'
  //         onClick={handleSubmitCorrectAnswers}
  //         sx={{ marginTop: 2 }}
  //       >
  //         Submit Correct Answers
  //       </Button>
  //     </Box>
  //   </div>
  // );
}
