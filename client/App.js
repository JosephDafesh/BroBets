import React, { useState } from 'react';
import EventAnswer from './EventAnswer';
import Dashboard from './Dashboard';
import SignIn from './SignIn';
import SignUp from './SignUp';
import NewEvent from './NewEvent';
import ScoreBoard from './ScoreBoard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AdminEvent from './AdminEvent';
import Questionnaire from './Questionnaire';
import { useStore } from './store';
import NavBar from './Navbar';
import AdminEvents from './AdminEvents';
import CreateBets from './CreateBets';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './styling/theme';
import { makeStyles } from '@mui/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function App() {

  const useStyles = makeStyles({
    '@global': {
      body: {
        backgroundImage: 'radial-gradient(circle at center, #E4FDE1, #ABEBC6)',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}});
    
  const globalStyles = useStyles();

  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  const event_id = useStore((state) => state.event_id);
  const snackbarMessage = useStore((state) => state.snackbarMessage);

  console.log('snackbarMessage is', snackbarMessage);
  const setSnackbarMessage = useStore((state) => state.setSnackbarMessage);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Snackbar
              open={Boolean(snackbarMessage)}
              autoHideDuration={6000}
              onClose={() => setSnackbarMessage(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              {snackbarMessage && (
                <Alert severity={snackbarMessage.severity}>
                  {snackbarMessage.message}
                </Alert>
              )}
            </Snackbar>
            <NavBar />
            <Routes>
              <Route
                path='/'
                element={
                  <>
                    {currentForm === 'login' ? (
                      <SignIn onFormSwitch={toggleForm} />
                    ) : (
                      <SignUp onFormSwitch={toggleForm} />
                    )}
                  </>
                }
              />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route
                path='/newevent'
                element={event_id ? <CreateBets /> : <NewEvent />}
              />
              <Route path='scoreboard/:event_id' element={<ScoreBoard event_id={event_id} />} />
              <Route path='/eventanswer' element={<EventAnswer />} />
              <Route path='/questionnaire' element={<Questionnaire />} />
              <Route
                path='/events'
                element={event_id ? <AdminEvent /> : <AdminEvents />}
              />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
