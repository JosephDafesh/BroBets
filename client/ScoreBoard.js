import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './Navbar';

const userColumns = [
  { field: 'nickname', headerName: 'Nickname', width: 150 },
  { field: 'rank', headerName: 'Rank', width: 110 },
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

export default function ScoreBoard({ event_id }) {
  const [userData, setUserData] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [allUserAnswersData, setAllUserAnswersData] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    fetch(`/api/leaderboard/${event_id}`)
      .then(response => response.json())
      .then(data => {
        setUserData(data.map(({ user_id, ...remainingData }) => remainingData));
      })
      .catch(error => console.log('Error fetching user data:', error));

    fetch(`/api/leaderboard/${event_id}/all-answers`)
      .then(response => response.json())
      .then(data => {
        setAllUserAnswersData(data.map(({ question_id, ...remainingData }) => remainingData)); 
      })
      .catch(error => console.log('Error fetching all user answers:', error));

    if (gameOver) {
      fetch(`/get-questionnaire/${event_id}`)
        .then(response => response.json())
        .then(data => {
          setQuestionsData(data.map(({ question_id, ...remainingData }) => remainingData));
        })
        .catch(error => console.log('Error fetching questions:', error));
    }
  }, [event_id, gameOver]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 12, height: 900, width: '100%' }}>
      <Navbar />
      <DataGrid
        rows={userData}
        columns={userColumns}
        pageSize={5}
        disableRowSelectionOnClick
      />
      <DataGrid
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
      )}
    </Box>
  );
}
