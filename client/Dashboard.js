import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

export default function Dashboard() {

  const [user, setUser] = useState(null);
  // const [events, setEvents] = useState([]);
  // const setEvents = useStore(state => state.setEvents);
  // const events = useStore(state => state.events);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const userRes = await fetch('user/get', {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     if (userRes.ok) {
  //       const u = await userRes.json();
  //       setUser(u);
  //       const eventsRes = await fetch(`/event/events-for/${u.user_id}`, {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //       });
  //       if (eventsRes.ok) {
  //         const e = await eventsRes.json();
  //         setEvents(e);
  //       }
  //     }
  //   };
  //   fetchData();
  // }, []);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Event 1',
      date: '2023-01-01',
      description: 'Vote on if chat GPT can fix this for us!',
    },
    {
      id: 2,
      title: 'Event 2',
      date: '2023-02-01',
      description: 'The second event is even more exciting. Do not miss it!',
    },
    {
      id: 3,
      title: 'Event 3',
      date: '2023-03-01',
      description: 'Join us for the third event to learn something new.',
    },
  ]);

  return (
    <div id="dashboard">
      <Navbar />
      <Box sx={{ pt: '12vh', px: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {events.map((event) => (
          <Card key={event.id} sx={{ width: '100%', maxWidth: 800, my: 2 }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                {event.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {event.date}
              </Typography>
              <Typography variant="body2">
                {event.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
}