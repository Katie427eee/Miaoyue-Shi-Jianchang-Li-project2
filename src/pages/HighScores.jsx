// src/pages/HighScores.jsx
import React from "react";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/highscores.css";

const HighScores = () => {
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
            <tr><td>Emily</td><td>12</td><td>5</td></tr>
            <tr><td>Liam</td><td>10</td><td>7</td></tr>
            <tr><td>Sophia</td><td>9</td><td>3</td></tr>
            <tr><td>Noah</td><td>8</td><td>6</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HighScores;
