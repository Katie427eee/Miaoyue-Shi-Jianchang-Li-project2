// src/pages/Rules.jsx
import React from "react";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/rules.css";

const Rules = () => {
  return (
    <div className="rules-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Rules of Battleship</h2>
        <ol>
          <li>Set up: Each player places three ships on their board, either vertically or horizontally, without overlapping.</li>
          <li>Take turns: Players take turns calling out coordinates on their opponent's board.</li>
          <li>Respond: The opponent responds with "hit" or "miss".</li>
          <li>Mark hits: The player who is hit marks the hit on their board with a <span className="highlight-green">green check mark</span>.</li>
          <li>Mark Miss: The player who misses marks the miss on their board with a <span className="highlight-black">black and white cross mark</span>.</li>
          <li>Sink ships: When all of a ship's spaces are hit, the ship's owner announces it has been sunk.</li>
          <li>Win: The first player to sink all of their opponent's ships wins.</li>
        </ol>
        <section className="credits">
          <h3>Credits</h3>
          <p>Made by <a href="mailto:shi.mia@northeastern.edu">Miaoyue Shi</a> and <a href="https://github.com/EvilLeeovo">Jianchang</a></p>
        </section>
      </div>
    </div>
  );
};

export default Rules;
