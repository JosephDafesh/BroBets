import React from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import SignIn from "./signin"
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";

function App(){
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<SignIn />} /> */}
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    )
}

export default App;