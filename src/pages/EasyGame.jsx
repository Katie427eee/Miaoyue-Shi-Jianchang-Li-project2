import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/easygame.css";
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

const EasyGame = () => {
  const { easyState: state, easyDispatch: dispatch } = useGame();

  // new game
  useEffect(() => {
    if (state.ships.length === 0) {
      dispatch({ type: "SET_GAME_STATE", payload: { ships: generateShips() } });
    }
  }, [dispatch, state.ships]);

  // handle player click
  const handleCellClick = (index) => {
    if (state.hits.includes(index) || state.misses.includes(index) || state.gameOver) return;

    let isHit = state.ships.some((ship) => ship.includes(index));
    if (isHit) {
      dispatch({ type: "SET_HIT", payload: index });
    } else {
      dispatch({ type: "SET_MISS", payload: index });
    }
  };

  // check gameover
  useEffect(() => {
    if (state.ships.length > 0) { // make sure there is ship
      let allSunk = state.ships.every((ship) => ship.every((pos) => state.hits.includes(pos)));
      if (allSunk) {
        dispatch({ type: "SET_GAME_OVER" });
        localStorage.removeItem("easyGameState"); // delete localStorage
      }
    }
  }, [state.hits, state.ships, dispatch]);
  

  // timer
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

  // reset
  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
    localStorage.removeItem("easyGameState");
  };

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Easy Mode - Free Play</h2>
        <h3>Time Elapsed: {state.timer} seconds</h3>
        {state.gameOver && <h3 className="game-over">Game Over! Player Won!</h3>}
        <button className="reset-button" onClick={resetGame}>Reset Game</button>
        <div className="game-board">
          {state.board.map((_, index) => (
            <div
              key={index}
              className={`tile ${state.hits.includes(index) ? "hit" : ""} ${state.misses.includes(index) ? "miss" : ""}`}
              onClick={() => handleCellClick(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EasyGame;
