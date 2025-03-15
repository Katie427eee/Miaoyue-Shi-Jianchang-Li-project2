// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/common.css";

const Navbar = () => {
    console.log("Navbar component rendered!");
    return (
        <nav>
          <div className="game-title">Battleship War</div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/setup">Game</Link></li>
            <li><Link to="/rules">Rules</Link></li>
            <li><Link to="/highscores">High Scores</Link></li>
          </ul>
        </nav>
    );
};

export default Navbar;
