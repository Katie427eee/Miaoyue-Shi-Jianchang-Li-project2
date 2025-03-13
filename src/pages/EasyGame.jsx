// src/pages/EasyGame.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/easygame.css";

const generateShips = () => {
  const shipSizes = [5, 4, 3, 3, 2];
  let ships = [];
  let occupied = new Set();

  for (let size of shipSizes) {
    let placed = false;
    while (!placed) {
      let isVertical = Math.random() > 0.5;
      let start = Math.floor(Math.random() * 100);
      let positions = [];

      for (let i = 0; i < size; i++) {
        let pos = isVertical ? start + i * 10 : start + i;
        if (pos >= 100 || (isVertical && pos % 10 !== start % 10) || occupied.has(pos)) {
          positions = [];
          break;
        }
        positions.push(pos);
      }

      if (positions.length === size) {
        ships.push(positions);
        positions.forEach((pos) => occupied.add(pos));
        placed = true;
      }
    }
  }
  return ships;
};

const EasyGame = () => {
  const [board, setBoard] = useState(Array(100).fill(null));
  const [ships, setShips] = useState(generateShips());
  const [hits, setHits] = useState([]);
  const [misses, setMisses] = useState([]);
  const [gameOver, setGameOver] = useState(false);


  const handleCellClick = (index) => {
    if (hits.includes(index) || misses.includes(index) || gameOver) return; 

    let isHit = ships.some((ship) => ship.includes(index));
    if (isHit) {
      setHits([...hits, index]);
    } else {
      setMisses([...misses, index]);
    }
  };

  useEffect(() => {
    let allSunk = ships.every((ship) => ship.every((pos) => hits.includes(pos)));
    if (allSunk) {
      setGameOver(true);
    }
  }, [hits, ships]);

  const resetGame = () => {
    setBoard(Array(100).fill(null));
    setShips(generateShips());
    setHits([]);
    setMisses([]);
    setGameOver(false);
  };

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Easy Mode - Free Play</h2>
        {gameOver && <h3 className="game-over">Game Over! Player Won!</h3>}
        <div className="game-board">
          {board.map((_, index) => (
            <div
              key={index}
              className={`tile ${hits.includes(index) ? "hit" : ""} ${misses.includes(index) ? "miss" : ""}`}
              onClick={() => handleCellClick(index)}
            >
            </div>
          ))}
        </div>
        <button className="reset-button" onClick={resetGame}>Reset Game</button>
      </div>
    </div>
  );
};

export default EasyGame;
