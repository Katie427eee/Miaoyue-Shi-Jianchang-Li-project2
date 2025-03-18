// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/common.css";
import { useGame } from "../context/GameContext";

const Navbar = () => {

  // const { normalState, easyState } = useGame();
  const { normalState, normalDispatch, easyState, easyDispatch } = useGame();
  const navigate = useNavigate();

  const getGameLink = () => {
    if (!normalState.gameOver && normalState.playerShips.length > 0) {
      return "/game/normal";  
    } else if (!easyState.gameOver && easyState.ships.length > 0) {
      return "/game/easy";  
    } else {
      return "/setup";  
    }
  };  


  return (
    <nav>
      <div className="game-title">Battleship War</div>
      <ul>
        <li><Link to="/">Home</Link></li>
        {/* <li><Link to={"/setup"}>Game</Link></li> */}
        <li><Link to={getGameLink()}>Game</Link></li>
        <li><Link to="/rules">Rules</Link></li>
        <li><Link to="/highscores">High Scores</Link></li>
      </ul>
    </nav>
  );
    
};

export default Navbar;
