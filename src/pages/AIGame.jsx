import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/normalgame.css";

const AIGame = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [playerBoard, setPlayerBoard] = useState(Array(100).fill(null));
  const [playerShips, setPlayerShips] = useState([]);
  const [aiHits, setAiHits] = useState([]);
  const [playerHits, setPlayerHits] = useState([]);
  const [playerMisses, setPlayerMisses] = useState([]);
  const [aiMisses, setAiMisses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [enemyBoard, setEnemyBoard] = useState(Array(100).fill(null));

  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${id}`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
      });
  }, [id]);

  
  useEffect(() => {
    if (playerShips.length === 0) {
      const ships = generateShips();
      setPlayerShips(ships.flat());
    }
  }, [playerShips]);

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
        let validPlacement = true;

        for (let i = 0; i < size; i++) {
          let pos = isVertical ? start + i * 10 : start + i;

          if (!isVertical && Math.floor(start / 10) !== Math.floor(pos / 10)) {
            validPlacement = false;
            break;
          }

          if (pos >= 100 || occupied.has(pos)) {
            validPlacement = false;
            break;
          }
          positions.push(pos);
        }

        if (validPlacement && positions.length === size) {
          ships.push(positions);
          positions.forEach((pos) => occupied.add(pos));
          placed = true;
        }
      }
    }
    return ships;
  };

  const handleAttack = (index) => {
    if (!playerTurn || playerHits.includes(index) || playerMisses.includes(index) || gameOver) return;

    if (game.player2Board.includes(index)) {
      setPlayerHits([...playerHits, index]);
    } else {
      setPlayerMisses([...playerMisses, index]);
    }

    setPlayerTurn(false);
    setTimeout(() => enemyTurn(), 800);
  };

  const enemyTurn = () => {
    let available = Array.from({ length: 100 }, (_, i) => i)
      .filter(i => !aiHits.includes(i) && !aiMisses.includes(i));

    if (available.length === 0) return;

    const index = available[Math.floor(Math.random() * available.length)];
    if (playerShips.includes(index)) {
      setAiHits([...aiHits, index]);
    } else {
      setAiMisses([...aiMisses, index]);
    }

    setPlayerTurn(true);
  };

  useEffect(() => {
    if (!gameOver && game) {
      const playerWin = game.player2Board.every(pos => playerHits.includes(pos));
      const aiWin = playerShips.every(pos => aiHits.includes(pos));
      if (playerWin || aiWin) {
        setGameOver(true);
      }
    }
  }, [playerHits, aiHits, game, playerShips, gameOver]);

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Battle vs AI</h2>
        {gameOver && (
          <h3 className="game-over">
            {playerHits.length > aiHits.length ? "You Win!" : "AI Wins!"}
          </h3>
        )}
        <div className="boards-container">
          <div>
            <h3>AI Board</h3>
            <div className="game-board">
              {enemyBoard.map((_, index) => (
                <div
                  key={index}
                  className={`tile 
                  ${playerHits.includes(index) ? "hit-enemy" : playerMisses.includes(index) ? "miss" : ""}`}
                  onClick={() => handleAttack(index)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3>Your Board</h3>
            <div className="game-board">
              {playerBoard.map((_, index) => (
                <div
                  key={index}
                  className={`tile 
                  ${aiHits.includes(index) ? "hit-player" : playerShips.includes(index) ? "ship" : ""}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AIGame;
