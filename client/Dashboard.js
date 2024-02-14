import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useStore } from './store';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const setUser_id = useStore((state) => state.setUser_id);
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);
  // const setEvents = useStore(state => state.setEvents);
  // const events = useStore(state => state.events);

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
        } else {
          setSnackbarMessage({
            severity: 'error',
            message: 'fetching user events failed',
          });
        }
      } else {
        setSnackbarMessage({
          severity: 'error',
          message: 'fetching user data failed',
        });
      }
    };
    fetchData();
  }, []);
  // const [events, setEvents] = useState([
  //   {
  //     event_id: 1,
  //     event_title: 'Event 1',
  //     created_at: '2023-01-01',
  //     has_ended: true,
  //     total_points: 100,
  //     players_count: 99,
  //     place: 1,
  //     score: 95,
  //   },
  //   {
  //     event_id: 2,
  //     event_title: 'Event 2',
  //     created_at: '2023-02-01',
  //     has_ended: false,
  //     total_points: 100,
  //     players_count: 5,
  //     place: 1,
  //     score: 20,
  //   },
  //   {
  //     event_id: 3,
  //     event_title: 'Event 3',
  //     created_at: '2023-03-01',
  //     has_ended: false,
  //     total_points: 120,
  //     players_count: 8,
  //     place: 3,
  //     score: 80,
  //   },
  // ]);

  return (
    <div id='dashboard'>
      {/* <Navbar /> */}
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
            sx={{ width: '100%', maxWidth: 800, my: 2 }}
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
