import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useStore } from './store';
import { useNavigate } from 'react-router-dom';

export default function AdminEvents() {
  const { user_id } = useStore.getState();
  const [adminEvents, setAdminEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const adminEventsRes = await fetch(`/event/admin-events/${user_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (adminEventsRes.ok) {
        const a = await adminEventsRes.json();
        setAdminEvents(a);
      } else {
        console.log('Fetching admin events for user failed');
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        pt: '12vh',
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {adminEvents.length === 0 && (
        <Typography>You haven't created any events yet.</Typography>
      )}
      {adminEvents.map((e) => (
        <Card key={e.event_id} sx={{ width: '100%', maxWidth: 800, my: 2 }}>
          <CardContent>
            <Typography
              variant='h5'
              component='h2'
              sx={{ cursor: 'pointer' }}
              onClick={() => useStore.setState({ event_id: e.event_id })}
            >
              {e.event_title}
            </Typography>{' '}
            <Typography color='textSecondary' gutterBottom>
              event_id: {e.event_id}
            </Typography>
            <Typography color='textSecondary' gutterBottom>
              {e.created_at}
            </Typography>
            <Typography variant='body2'>
              Rank: {e.place}/{e.players_count}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
