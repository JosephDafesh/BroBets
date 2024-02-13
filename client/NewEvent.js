import React, { useState } from 'react';
import { FormControl, Box, TextField, Button, Typography, Chip } from '@mui/material';
import { DatePicker, TimeField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
// will have to add localization provider to app.js

export default function NewEvent() {
  
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
  const [newBetPrompt, setNewBetPrompt] = useState('');
  const [newBetType, setNewBetType] = useState(null);

  const updateEventName = (e) => {
    setEventName(e.target.value);
    console.log('eventName:', e.target.value)
  };

  const updateLastCallDate = (newTimestamp) => {
    newTimestamp = dayjs(newTimestamp).format('YYYY-MM-DD');
    setLastCallDate(newTimestamp);
    console.log('lastCallDate:', newTimestamp);
  };

  const updateLastCallTime = (newTimestamp) => {
    newTimestamp = dayjs(newTimestamp).format('HH:mm');
    setLastCallTime(newTimestamp);
    console.log('lastCallTime:', newTimestamp);
  };

  const combineDateTime = () => {
    // combine lastCallDate and lastCallTime into one timestamp
    const dateTime = dayjs(`${lastCallDate}T${lastCallTime}`);
    const timestampDateTime = dateTime.toISOString();
    console.log('dateTime:', timestampDateTime);
    return timestampDateTime;
  };

  const updateNewBetPrompt = (e) => {
    setNewBetPrompt(e.target.value);
    console.log('newBetPrompt:', e.target.value)
  };

  const handleAddEvent = () => {
    // query db to insert new event
    combineDateTime();
  };

  const handleAddBet = () => {
    // query db to insert new bet
  };

  return (
    <FormControl>
        <Box>
            <Typography variant="h4">Create a New Event!</Typography>
            <TextField label="Event Name" onChange={updateEventName}/>
            <DatePicker label="Last call date" onChange={updateLastCallDate}/>
            <TimeField label="Last call time" onChange={updateLastCallTime} />
            <Button onClick={handleAddEvent} variant="contained" color="success" >Create Event</Button>
        </Box>
        <Box>
            <Typography variant="h5">Add Bets!</Typography>
            <Chip label="Yes or No" onClick={() => setNewBetType('Yes or No')} />
            <Chip label="Player Input" onClick={() => setNewBetType('Player Input')}/>
        </Box>
        {newBetType !== null && 
            <Box>
                <TextField label="Question" onChange={updateNewBetPrompt}/>
                <Button onClick={handleAddBet} variant="contained" color="success" >Add Bet</Button>
            </Box>
        }
    </FormControl>
  );
};

