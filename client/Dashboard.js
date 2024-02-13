import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import JoinGame from "./joinGame";
import CreateGame from "./createGame";
import styles from "./styling/styles.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userRes = await fetch("user/get", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (userRes.ok) {
        const u = await userRes.json();
        console.log("user from db is", u);
        setUser(u);
        const eventsRes = await fetch(`/event/events-for/${u.user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (eventsRes.ok) {
          const e = await eventsRes.json();
          setEvents(e);
        }
      }
    };
    fetchData();
  }, []);

  console.log("user is", user);
  return (
    <div id="dashboard">
      <div id="navbar">
        <Navbar />
      </div>
      <div id="dashboardContainers" align="center">
        <CreateGame align="center" />
        <div>OR</div>
        <br></br>
        <JoinGame />
      </div>
    </div>
  );
}
