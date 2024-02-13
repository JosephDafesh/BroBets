import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function Dashboard() {
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
          setEvents(e);
        }
      }
    };
    fetchData();
  }, []);

  console.log('user is', user);
  return (
    <div>
      <h1>Dashboard</h1>
      <button>hello</button>
      <Navbar />
    </div>
  );
}
