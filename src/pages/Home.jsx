// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext"; 
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/home.css";
import backgroundImg from "../assets/battleship-background.jpg";

const Home = () => {
  const { normalState, normalDispatch, easyState, easyDispatch } = useGame();
  const navigate = useNavigate();

  const handlePlayNormal = () => {
    //console.log("Normal Game State:", normalState);
    if (!normalState.gameOver && normalState.playerShips.length > 0) {
      //console.log("Navigating to Normal Game...");  
      navigate("/game/normal");  
    } else {
      //console.log("Resetting Normal Game...");
      normalDispatch({ type: "RESET_GAME" });
      localStorage.removeItem("normalGameState");
      navigate("/setup");  
    }
  };  

  const handlePlayEasy = () => {
    if (!easyState.gameOver && easyState.ships.length > 0) {
      navigate("/game/easy")
    } else {
      easyDispatch({ type: "RESET_GAME" });  
      localStorage.removeItem("easyGameState");
      navigate("/game/easy");
    }
  };


  return (
    <div className="home-page">
      <Navbar />
      <div className="background"></div>
      <header>
        <h1 className="title">Battleship War</h1>
        <img src={backgroundImg} alt="Battleship Background" className="foreground-image" />
        <div className="mode-buttons-container">
          <div className="mode-buttons">
            {/* <Link to="/setup" className="mode-button normal">Play Normal Mode</Link> */}
            <button className="mode-button normal" onClick={handlePlayNormal}>Play Normal Mode</button>
            <button className="mode-button easy" onClick={handlePlayEasy}>Play Easy Mode</button>
            {/* <Link to="/game/easy" className="mode-button easy">Play Easy Mode</Link> */}

          </div>
        </div>
      </header>
      <footer>
        <p>&copy; 2025 Battleship Mock Project_1</p>
      </footer>
    </div>
  );
};

export default Home;
