import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useStore } from './store';

const userColumns = [
  { field: 'nickname', headerName: 'Nickname', width: 150 },
  { field: 'score', headerName: 'Score', type: 'number', width: 110 },
];

const questionColumns = [
  { field: 'question', headerName: 'Question', width: 300 },
  { field: 'answer', headerName: 'Answer', width: 120 },
];

const allUserAnswersColumns = [
  { field: 'question', headerName: 'Question', width: 300 },
  { field: 'usersAnswers', headerName: 'All User Answers', width: 300 },
];

export default function ScoreBoard() {
  const { event_id } = useStore.getState();
  const [leaderboard, setLeaderBoard] = useState(null);
  const [answers, setAnswers] = useState(null);
  console.log(leaderboard);
  console.log(answers);
  useEffect(() => {
    const fetchData = async () => {
      const leaderboardRes = await fetch(`/event/leaderboard/${event_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (leaderboardRes.ok) {
        const l = await leaderboardRes.json();
        setLeaderBoard(l);
      }
      const answersRes = await fetch(`/event/answers/${event_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (answersRes.ok) {
        const a = await answersRes.json();
        setAnswers(a);
      }
    };
    fetchData();
    // fetch(`/event/leaderboard/${event_id}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setUserData(data.map(({ user_id, ...remainingData }) => remainingData));
    //   })
    //   .catch((error) => console.log('Error fetching user data:', error));
    // fetch(`/api/leaderboard/${event_id}/all-answers`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setAllUserAnswersData(
    //       data.map(({ question_id, ...remainingData }) => remainingData)
    //     );
    //   })
    //   .catch((error) => console.log('Error fetching all user answers:', error));
    // if (gameOver) {
    //   fetch(`/get-questionnaire/${event_id}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setQuestionsData(
    //         data.map(({ question_id, ...remainingData }) => remainingData)
    //       );
    //     })
    //     .catch((error) => console.log('Error fetching questions:', error));
    // }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        mt: 12,
        height: 900,
        width: '100%',
      }}
    >
      {leaderboard && (
        <DataGrid
          rows={leaderboard}
          columns={userColumns}
          pageSize={5}
          disableRowSelectionOnClick
          getRowId={(row) => row.user_id}
          sortModel={[
            {
              field: 'score', // Field name of the Score column
              sort: 'desc', // Descending order
            },
          ]}
        />
      )}
      {/* <DataGrid
        rows={allUserAnswersData}
        columns={allUserAnswersColumns}
        pageSize={5}
        disableRowSelectionOnClick
      />
      {gameOver && (
        <DataGrid
          rows={questionsData}
          columns={questionColumns}
          pageSize={5}
          disableRowSelectionOnClick
        />
      )} */}
    </Box>
  );
}
