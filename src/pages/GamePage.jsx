// src/pages/GamePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/game.css";

const GamePage = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;

  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${gameId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load game:", err);
        setLoading(false);
      });
  }, [gameId]);

  const renderBoard = (isPlayer1) => {
    if (!game) return null;

    const hits = isPlayer1 ? game.player1Hits : game.player2Hits;
    const board = Array(100).fill(null).map((_, i) =>
      hits.includes(i) ? "hit" : null
    );

    return (
      <div className={`game-board ${!isLoggedIn ? "disabled-board" : ""}`}>
        {board.map((status, i) => (
          <div
            key={i}
            className={`tile ${
              status === "hit"
                ? isPlayer1
                  ? "hit-player"
                  : "hit-enemy"
                : ""
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="game-page">
        <Navbar />
        <div className="background"></div>
        <div className="content-wrapper">
          <h2>Loading game...</h2>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-page">
        <Navbar />
        <div className="background"></div>
        <div className="content-wrapper">
          <h2>Game not found.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Game ID: {gameId}</h2>
        <p>{game.player1} vs {game.player2 || "Waiting..."}</p>
        {game.winner && (
  <div className="winner-banner">
    <b>{game.winner}</b> won this game!
  </div>
)}

        <div className="boards-container">
          <div>
            <h3>{game.player1}'s Board</h3>
            {renderBoard(true)}
          </div>
          <div>
            <h3>{game.player2 || "Opponent"}'s Board</h3>
            {renderBoard(false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
