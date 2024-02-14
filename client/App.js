import React, { useState } from "react";
import EventAnswer from "./EventAnswer";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import NewEvent from "./NewEvent"
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
import ScoreBoard from './ScoreBoard';
import AdminEvent from "./AdminEvent";

  

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <Router>
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
        <Route path='/event' element={<EventAnswer />} />
        <Route path='/scoreboard' element={<ScoreBoard />} />
        <Route path='/newevent' element={<NewEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
