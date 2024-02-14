import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleScoreBoardClick = () => {
    navigate('/scoreboard');
  }

  return (
    <AppBar
      position='fixed'
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 2,
      }}
    >
      <Container maxWidth='lg'>
        <Toolbar
          variant='regular'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            bgcolor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton
            edge='start'
            aria-label='home'
            onClick={handleHomeClick}
            sx={{ mr: 5, color: 'blue' }}
          >
            <BarChartIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              ml: '-18px',
              px: 0,
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {/* Simplified Buttons without Typography and with a light blue color */}
              <Button sx={{ color: 'black' }}> Dashboard </Button>
              <Button sx={{ color: 'black' }}>Events </Button>
              <Button sx={{ color: 'black' }}>Create Event </Button>
              <Button sx={{ color: 'black' }} onClick={handleScoreBoardClick}>ScoreBoard </Button>
              <Button sx={{ color: 'black' }}>Something else </Button>
            </Box>
          </Box>
          <Button
            variant='text'
            color='error'
            sx={{ ml: 'auto', minWidth: '100px' }}
            onClick={async () => {
              await fetch('/user/signout');
              navigate('/');
            }}
          >
            Sign out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
