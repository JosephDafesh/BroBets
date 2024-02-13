import React, { useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import NewEvent from "./NewEvent"
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
            <Routes>
                <Route
                path='/'
                // element={<NewEvent />}
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
                <Route path='/newevent' element={<NewEvent />} />
            </Routes>
        </Router>
    </LocalizationProvider>
  );
}

export default App;
