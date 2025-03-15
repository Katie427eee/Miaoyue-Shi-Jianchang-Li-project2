// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/home.css";
import backgroundImg from "../assets/battleship-background.jpg";

const Home = () => {
    return (
      <div className="home-page">
        <Navbar />
        <div className="background"></div>
        <header>
          <h1 className="title">Battleship War</h1>
          <img src={backgroundImg} alt="Battleship Background" className="foreground-image" />
          <div className="mode-buttons-container">
            <div className="mode-buttons">
              <Link to="/setup" className="mode-button normal">Play Normal Mode</Link>
              <Link to="/game/easy" className="mode-button easy">Play Easy Mode</Link>
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
