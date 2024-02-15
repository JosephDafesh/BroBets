import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Make sure to import DeleteIcon
import { useStore } from './store';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function AdminEvents() {
  const { user_id } = useStore.getState();
  const [adminEvents, setAdminEvents] = useState([]);
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);
  const setEvent_id = useStore((state) => state.setEvent_id);

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
      setAdminEvents(adminEvents.filter((e) => e.event_id !== event_id));
      setSnackbarMessage({
        severity: 'success',
        message: 'deleted event successfully',
      });
    } else {
      setSnackbarMessage({
        severity: 'error',
        message: 'deleted event failed',
      });
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
        <Card
          key={e.event_id}
          sx={{ width: '100%', maxWidth: 800, my: 2, cursor: 'pointer', 
            backgroundColor: 'secondary.light', '&:hover': {backgroundColor: 'secondary.main'}, 
            boxShadow: 3}}
        >
          <CardContent
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <Box>
              <Typography
                variant='h5'
                component='h2'
                sx={{ cursor: 'pointer' }}
                onClick={() => setEvent_id(e.event_id)}
              >
                {e.event_title}
              </Typography>
              <Typography color='textSecondary' gutterBottom>
                event_id: {e.event_id}
              </Typography>
              <Typography color='textSecondary' gutterBottom>
                {dayjs(e.last_call).format('MMMM D, YYYY h:mm A')}
              </Typography>
              <Typography variant='body2'>
                Rank: {e.place}/{e.players_count}
              </Typography>
            </Box>
            <IconButton
              aria-label='delete'
              onClick={() => deleteEvent(e.event_id)}
              sx={{ position: 'absolute', top: 10, right: 15, color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
