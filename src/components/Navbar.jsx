// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useAuth } from "../context/AuthContext";
import "../styles/common.css";

const Navbar = () => {
  const { normalState } = useGame();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav>
      <span className="game-title">Battleship</span>

      <ul className="nav-left">
        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
        <li><NavLink to={normalState?.playerShips?.length ? "/game/normal" : "/setup"} className={({ isActive }) => isActive ? "active" : ""}>New Game</NavLink></li>
        <li><NavLink to="/games" className={({ isActive }) => isActive ? "active" : ""}>All Games</NavLink></li>
        <li><NavLink to="/rules" className={({ isActive }) => isActive ? "active" : ""}>Rules</NavLink></li>
        <li><NavLink to="/highscores" className={({ isActive }) => isActive ? "active" : ""}>High Scores</NavLink></li>
      </ul>

      <ul className="nav-right">
        {user ? (
          <>
            <li><span style={{ color: "#66c2ff" }}>Hi, {user}</span></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink></li>
            <li><NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
