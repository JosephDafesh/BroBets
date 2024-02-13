import React from "react";
import Dashboard from "./Dashboard";
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
  

function App(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </Router>
    )
}

export default App;