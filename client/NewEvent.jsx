import React, { useState } from 'react';
import { FormControl, Box, TextField, Button, Typography, Chip } from '@mui/material';
import { DatePicker, TimeField } from '@mui/x-date-pickers';
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
  const [selectedDate, handleDateChange] = useState(null);
  const [selectedTime, handleTimeChange] = useState(null);
  const [bets, setBets] = useState([]);

  const [addingBetType, setAddingBetType] = useState('');

  const handleAddBet = (betType) => {
    setBets([...bets, { betType, question, options}]);
  };

  return (
    <FormControl>
        <Box>
            <TextField label="Event Name"/>
            <DatePicker label="Last call date"/>
            <TimeField label="Last call time"/>
        </Box>
        <Box>
            <Typography variant="h6">Create Bets</Typography>
            <Chip label="Yes or No" />
            <Chip label="Player Input" />
        </Box>
        {addingBetType === 'Yes or No' && 
            <Box>
                <TextField label="Question"/>
                <TextField label="Option 1"/>
                <TextField label="Option 2"/>
            </Box>
        }
        {addingBetType === 'Player Input' && 
            <Box>
                <TextField label="Question"/>
            </Box>
        }
        <Box>
            <Button variant="contained" color="success" >Create Event</Button>
        </Box>
    </FormControl>
  );
};

