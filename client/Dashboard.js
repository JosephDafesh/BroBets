import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useStore } from './store';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const setUser_id = useStore((state) => state.setUser_id);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await fetch('user/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (userRes.ok) {
        const u = await userRes.json();
        setUser_id(u.user_id);
        const eventsRes = await fetch(`/event/events-for/${u.user_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (eventsRes.ok) {
          const e = await eventsRes.json();
          setEvents(e);
        }
      }
    };
    fetchData();
  }, [setUser_id]);

  const handleCardClick = (event_id) => {
    navigate(`/scoreboard/${event_id}`); 
  };

  return (
    <div id='dashboard'>
      <Box
        sx={{
          pt: '12vh',
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {events.map((event) => (
          <Card
            key={event.event_id}
            sx={{ width: '100%', maxWidth: 800, my: 2, cursor: 'pointer' }}
            onClick={() => handleCardClick(event.event_id)} 
          >
            <CardContent>
              <Typography variant='h5' component='h2'>
                {event.event_title}
              </Typography>
              <Typography color='textSecondary' gutterBottom>
                {event.created_at}
              </Typography>
              <Typography variant='body2'>
                Rank: {event.place}/{event.players_count}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}
