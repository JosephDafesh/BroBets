import React, { useState } from 'react';
import EventAnswer from './EventAnswer';
import Dashboard from './Dashboard';
import SignIn from './signin';
import SignUp from './SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <Router>
      <Routes>
        <Route
          path='/eve'
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
        <Route path='/' element={<EventAnswer />} />
      </Routes>
    </Router>
  );
}

export default App;
