import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/normalgame.css";
import { useGame } from "../context/GameContext";


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
        if (pos >= 100 || (isVertical && pos % 10 !== start % 10) || (!isVertical && Math.floor(start / 10) !== Math.floor(pos / 10)) || occupied.has(pos)) {
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

const NormalGame = () => {
    const { normalState: state, normalDispatch: dispatch } = useGame();

    useEffect(() => {
        if (state.playerShips.length === 0 || state.enemyShips.length === 0) {
          dispatch({
            type: "SET_GAME_STATE",
            payload: { playerShips: generateShips(), enemyShips: generateShips() }
          });
        }
      }, [dispatch, state.playerShips, state.enemyShips]);

      useEffect(() => {
        let interval;
        if (!state.gameOver) {
          interval = setInterval(() => {
            dispatch({ type: "SET_GAME_STATE", payload: { timer: state.timer + 1 } });
          }, 1000);
        } else {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [state.gameOver, state.timer, dispatch]);

      const handlePlayerAttack = (index) => {
        if (!state.playerTurn || state.playerHits.includes(index) || state.playerMisses.includes(index) || state.gameOver) return;
      
        let isHit = state.enemyShips.some((ship) => ship.includes(index));
        if (isHit) {
          dispatch({ type: "SET_HIT_PLAYER", payload: index });
        } else {
          dispatch({ type: "SET_MISS_PLAYER", payload: index });
        }
      
        dispatch({ type: "SET_GAME_STATE", payload: { playerTurn: false } });
      
        setTimeout(() => enemyTurn(), 50);
      };


      const enemyTurn = () => {
        let attackIndex;

        if (state.hitStack.length > 0) {
            attackIndex = state.hitStack.pop();
        } else {
            let availableMoves = Array.from({ length: 100 }, (_, i) => i).filter(
            (i) => !state.enemyHits.includes(i) && !state.enemyMisses.includes(i)
            );

            if (availableMoves.length === 0) return;

            attackIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }

        let isHit = state.playerShips.some((ship) => ship.includes(attackIndex));
      
        if (isHit) {
          dispatch({ type: "SET_HIT_ENEMY", payload: attackIndex });

          let newHitStack = [...state.hitStack, ...getAdjacentTiles(attackIndex)];
          dispatch({ type: "SET_GAME_STATE", payload: { lastHit: attackIndex, hitStack: newHitStack } });
        } else {
          dispatch({ type: "SET_MISS_ENEMY", payload: attackIndex });
        }
      
        dispatch({ type: "SET_GAME_STATE", payload: { playerTurn: true } });
      };

      const getAdjacentTiles = (index) => {
        let adjacent = [];
        let row = Math.floor(index / 10);
        let col = index % 10;
      
        if (row > 0) adjacent.push(index - 10); // top
        if (row < 9) adjacent.push(index + 10); // down
        if (col > 0) adjacent.push(index - 1);  // left
        if (col < 9) adjacent.push(index + 1);  // right
      
        return adjacent.filter(i => !state.enemyHits.includes(i) && !state.enemyMisses.includes(i));
      };
      

  useEffect(() => {
    if (state.playerShips.length > 0 && state.enemyShips.length > 0) {
      let playerAllSunk = state.enemyShips.every((ship) => ship.every((pos) => state.playerHits.includes(pos)));
      let enemyAllSunk = state.playerShips.every((ship) => ship.every((pos) => state.enemyHits.includes(pos)));
  
      if (playerAllSunk || enemyAllSunk) {
        dispatch({ type: "SET_GAME_OVER" });
        localStorage.removeItem("normalGameState");
      }
      if (state.lastHit) {
        let hitShip = state.playerShips.find(ship => ship.includes(state.lastHit));
        if (hitShip && hitShip.every(pos => state.enemyHits.includes(pos))) {
          dispatch({ type: "SET_GAME_STATE", payload: { hitStack: [], lastHit: null } });
        }
      }
    }
  }, [state.playerHits, state.enemyHits, state.enemyShips, state.playerShips, dispatch]);
  

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
    localStorage.removeItem("normalGameState");
  };

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Normal Mode - Player vs Enemy</h2>
        <button className="reset-button" onClick={resetGame}>Reset Game</button>
        
        {state.gameOver && (
            <h3 className="game-over">
            {state.playerHits.length > state.enemyHits.length ? "Player Wins!" : "Enemy Wins!"}
            </h3>
        )}


        <div className="boards-container">
          {/* Player Board */}
          <div>
            <h3>Player Board</h3>
            <div className="game-board">
              {state.playerBoard.map((_, index) => (
                <div
                key={index}
                className={`tile 
                  ${state.enemyHits.includes(index) ? "hit-player" : state.playerShips.some(ship => ship.includes(index)) ? "ship" : ""}`}
              />
              ))}
            </div>
          </div>

          {/* Enemy Board */}
          <div>
            <h3>Enemy Board</h3>
            <div className="game-board">
              {state.enemyBoard.map((_, index) => (
                <div
                key={index}
                className={`tile 
                  ${state.playerHits.includes(index) ? "hit-enemy" : state.playerMisses.includes(index) ? "miss" : ""}`}
                onClick={() => handlePlayerAttack(index)}
              />
              ))}
            </div>
          </div>
        </div>

        <h3>Time Elapsed: {state.timer} seconds</h3>

      </div>
    </div>
  );
};

export default NormalGame;
