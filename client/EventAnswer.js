import React, {useState, useEffect} from "react";
import Navbar from "./Navbar";
import Questionnaire from "./Questionnaire";
import { Box } from "@mui/material";

export default function EventAnswer() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await fetch('user/get', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (userRes.ok) {
        const u = await userRes.json();
        console.log('user from db is', u);
        setUser(u);
        const eventsRes = await fetch(`/event/events-for/${u.user_id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (eventsRes.ok) {
          const e = await eventsRes.json();
          console.log(e)
          setEvents(e);
        }
      }
    };
    fetchData();
  }, []);

  console.log('user is', user);
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Navbar />
      <Box style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        height: '100vh', 
        width: '100%', 
        paddingTop: '12vh'
      }}>
        <Questionnaire user_id={user} />
      </Box>
    </div>
  );
}