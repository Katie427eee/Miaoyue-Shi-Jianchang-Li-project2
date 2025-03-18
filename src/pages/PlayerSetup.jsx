import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import Navbar from "../components/Navbar";
import "../styles/playerSetup.css";

const shipList = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

const PlayerSetup = () => {
  // const { normalDispatch: dispatch } = useGame();
  const { normalState, normalDispatch, easyState, easyDispatch } = useGame();
  const [availableShips, setAvailableShips] = useState(shipList);
  const [playerShips, setPlayerShips] = useState([]);
  const navigate = useNavigate();

  if (!normalState || !easyState) {
    return <div className="game-page"><h2>Loading...</h2></div>;
  }


  useEffect(() => {
    const lastMode = localStorage.getItem("lastMode");

    if (lastMode === "easy") {
        normalDispatch({ type: "RESET_GAME" });  
        localStorage.removeItem("normalGameState");
    } else if (lastMode === "normal") {
        easyDispatch({ type: "RESET_GAME" }); 
        localStorage.removeItem("easyGameState");
    }

    localStorage.setItem("lastMode", "setup");
  }, [normalDispatch, easyDispatch]);


  const handleDragStart = (e, ship) => {
    e.dataTransfer.setData("ship", JSON.stringify(ship));
  };

  const handleDrop = (e, index) => {
    let ship = JSON.parse(e.dataTransfer.getData("ship"));
    let newShip = Array(ship.size).fill(0).map((_, i) => index + i);

    if (newShip.some(pos => playerShips.flat().includes(pos) || pos >= 100 || Math.floor(pos / 10) !== Math.floor(index / 10))) {
      return;
    }

    setPlayerShips([...playerShips, newShip]);
    setAvailableShips(availableShips.filter(s => s.name !== ship.name));
  };


  const startGame = () => {
    if (playerShips.length !== 5) {
      alert("You must place all ships!");
      return;
    }

    // dispatch({ type: "SET_GAME_STATE", payload: { playerShips, enemyShips: generateShips() } });
    normalDispatch({
      type: "SET_GAME_STATE",
      payload: { 
        playerShips, 
        enemyShips: generateShips(),
        playerHits: [], 
        enemyHits: [], 
        playerMisses: [], 
        enemyMisses: [], 
        gameOver: false, 
        timer: 0
      }
    });

    // localStorage.setItem("lastMode", "normal");
    localStorage.setItem("normalGameState", JSON.stringify({
      playerShips,
      enemyShips: generateShips(),
      playerHits: [],
      enemyHits: [],
      playerMisses: [],
      enemyMisses: [],
      gameOver: false,
      timer: 0
    }));

    navigate("/game/normal");
  };

  const resetSetup = () => {
    setAvailableShips(shipList);
    setPlayerShips([]);
  };

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Place Your Ships</h2>

        <div className="ship-selection">
          {availableShips.map((ship, index) => (
            <div key={index} className="ship" draggable="true" onDragStart={(e) => handleDragStart(e, ship)}>
              {Array(ship.size).fill(0).map((_, i) => (
                <div key={i} className="ship-tile"></div>
              ))}
            </div>
          ))}
        </div>

        <div className="game-board">
          {Array(100).fill(null).map((_, index) => (
            <div key={index} className={`tile ${playerShips.flat().includes(index) ? "placed-ship" : ""}`}
                 onDragOver={(e) => e.preventDefault()}
                 onDrop={(e) => handleDrop(e, index)}>
            </div>
          ))}
        </div>

              <div className="button-container">
                  <button className="start-button" onClick={startGame}>Start Game</button>
                  <button className="reset-button" onClick={resetSetup}>Reset</button>
              </div>

      </div>
    </div>
  );
};

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

export default PlayerSetup;
