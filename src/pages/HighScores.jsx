// src/pages/HighScores.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/highscores.css";

const HighScores = () => {
  const [scores, setScores] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/scores`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setScores(data.scores || []);
        setCurrentUser(data.currentUser || null);
      })
      .catch((err) => console.error("Error loading scores:", err));
  }, []);

  return (
    <div className="highscores-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>High Scores</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Games Won</th>
              <th>Games Lost</th>
            </tr>
          </thead>
          <tbody>
            {scores.map(({ username, wins, losses }) => (
              <tr
                key={username}
                className={username === currentUser ? "highlight" : ""}
              >
                <td>{username}</td>
                <td>{wins}</td>
                <td>{losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighScores;
