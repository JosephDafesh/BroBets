import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Make sure to import DeleteIcon
import { useStore } from './store';

export default function AdminEvents() {
  const { user_id } = useStore.getState();
  const [adminEvents, setAdminEvents] = useState([]);
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);

  useEffect(() => {
    const fetchData = async () => {
      const adminEventsRes = await fetch(`/event/admin-events/${user_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (adminEventsRes.ok) {
        const events = await adminEventsRes.json();
        setAdminEvents(events);
      } else {
        console.log('Fetching admin events for user failed');
        setSnackbarMessage({
          severity: 'error',
          message: 'Fetching admin events for user failed',
        });
      }
    };
    fetchData();
  }, []);

  const deleteEvent = async (event_id) => {
    const response = await fetch(`/event/${event_id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setAdminEvents(adminEvents.filter(e => e.event_id !== event_id));
    } else {
      console.error('Failed to delete the event');
    }
  };

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
        <Card key={e.event_id} sx={{ width: '100%', maxWidth: 800, my: 2, position: 'relative' }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <Box>
              <Typography variant='h5' component='h2'>
                {e.event_title}
              </Typography>
              <Typography color='textSecondary' gutterBottom>
                event_id: {e.event_id}
              </Typography>
              <Typography color='textSecondary' gutterBottom>
                {e.created_at}
              </Typography>
              <Typography variant='body2'>
                Rank: {e.place}/{e.players_count}
              </Typography>
            </Box>
            <IconButton
              aria-label="delete"
              onClick={() => deleteEvent(e.event_id)}
              sx={{ position: 'absolute', top: 10, right: 15, color: 'red'}}
            >
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
