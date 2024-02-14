import React, { useState } from 'react';
import { FormControl, Box, TextField, Button, Typography } from '@mui/material';
import { DatePicker, TimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useStore } from './store';

export default function NewEvent() {
  const user_id = useStore((state) => state.user_id);
  const setEvent_id = useStore((state) => state.setEvent_id);

  // need user to enter: name of event, last call time

  // and then create bets
  // types: binary, multiple choice, input
  // add bet
  // select type
  // enter question
  // enter options
  // reorder bets?
  // button for create event at the bottom
  // present user with id of event to share with friends

  const [eventName, setEventName] = useState('');
  const [lastCallDate, setLastCallDate] = useState(null);
  const [lastCallTime, setLastCallTime] = useState(null);
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);

  const updateEventName = (e) => setEventName(e.target.value);

  const updateLastCallDate = (newTimestamp) => {
    newTimestamp = dayjs(newTimestamp).format('YYYY-MM-DD');
    setLastCallDate(newTimestamp);
  };

  const updateLastCallTime = (newTimestamp) => {
    newTimestamp = dayjs(newTimestamp).format('HH:mm');
    setLastCallTime(newTimestamp);
  };

  const combineDateTime = () => {
    // combine lastCallDate and lastCallTime into one timestamp
    const dateTime = dayjs(`${lastCallDate}T${lastCallTime}`);
    const timestampDateTime = dateTime.toISOString();
    console.log('dateTime:', timestampDateTime);
    return timestampDateTime;
  };

  // gotta pull user_id off of cookie first
  const handleAddEvent = async () => {
    // query db to insert new event
    const timestampDateTime = combineDateTime();

    const addEventResponse = await fetch(`/event/new/${user_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_title: eventName,
        last_call: timestampDateTime,
      }),
    });
    if (addEventResponse.ok) {
      const { event_id } = await addEventResponse.json();
      setEvent_id(event_id);
      setSnackbarMessage({
        severity: 'success',
        message: 'created new event successfully',
      });
    } else {
      setSnackbarMessage({
        severity: 'error',
        message: 'created new event failed',
      });
    }
  };

  return (
    <FormControl>
      <Box sx={{ marginTop: '100px' }}>
        <Typography variant='h4'>Create a New Event!</Typography>
        <TextField label='Event Name' onChange={updateEventName} />
        <DatePicker label='Last call date' onChange={updateLastCallDate} />
        <TimeField label='Last call time' onChange={updateLastCallTime} />
        <Button onClick={handleAddEvent} variant='contained' color='success'>
          Create Event
        </Button>
      </Box>
    </FormControl>
  );
}
