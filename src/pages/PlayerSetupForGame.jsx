import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/playerSetup.css";

const shipList = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
];

const PlayerSetupForGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [availableShips, setAvailableShips] = useState(shipList);
  const [playerShips, setPlayerShips] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.username);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
      });
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://localhost:5000/api/games/${id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.player1Ready && data.player2Ready) {
            navigate(`/game/${id}`);
          }
        });
    }, 3000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  const handleDragStart = (e, ship) => {
    e.dataTransfer.setData("ship", JSON.stringify(ship));
  };

  const handleDrop = (e, index) => {
    let ship = JSON.parse(e.dataTransfer.getData("ship"));
    let newShip = Array(ship.size)
      .fill(0)
      .map((_, i) => index + i);

    if (
      newShip.some(
        (pos) =>
          playerShips.flat().includes(pos) ||
          pos >= 100 ||
          Math.floor(pos / 10) !== Math.floor(index / 10)
      )
    ) {
      return;
    }

    setPlayerShips([...playerShips, newShip]);
    setAvailableShips(availableShips.filter((s) => s.name !== ship.name));
  };

  const handleSubmit = async () => {
    if (playerShips.length !== 5) {
      alert("You must place all ships!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/games/${id}/board`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ board: playerShips.flat() }),
      });

      if (res.ok) {
        alert("Ships placed! Waiting for other player...");
      } else {
        alert("Failed to submit board");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const resetSetup = () => {
    setAvailableShips(shipList);
    setPlayerShips([]);
  };

  if (!user || !game) return <div className="game-page"><h2>Loading...</h2></div>;

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Place Your Ships</h2>

        <div className="ship-selection">
          {availableShips.map((ship, index) => (
            <div
              key={index}
              className="ship"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, ship)}
            >
              {Array(ship.size)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="ship-tile"></div>
                ))}
            </div>
          ))}
        </div>

        <div className="game-board">
          {Array(100)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`tile ${playerShips.flat().includes(index) ? "placed-ship" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
              ></div>
            ))}
        </div>

        <div className="button-container">
          <button className="start-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="reset-button" onClick={resetSetup}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetupForGame;
