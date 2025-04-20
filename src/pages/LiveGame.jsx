// src/pages/LiveGame.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/normalgame.css";

const TILE_COUNT = 100;

const Tile = ({ isHit, isMiss, isShip, onClick, isDisabled }) => (
  <div
    className={`tile ${isHit ? "hit-enemy" : ""} ${isMiss ? "miss" : ""} ${isShip ? "ship" : ""}`}
    onClick={isDisabled ? null : onClick}
  />
);

const LiveGame = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playerRole, setPlayerRole] = useState(null); // 'player1' or 'player2'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchGame = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/games/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGame(data);
      }
    } catch (err) {
      console.error("Error loading game:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // fetch username from cookie-protected endpoint
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.username);
      });

    fetchGame();
    const interval = setInterval(fetchGame, 3000); // polling
    return () => clearInterval(interval);
  }, [id]);


  useEffect(() => {
    if (game && user) {
      if (game.player1 === user) {
        setPlayerRole("player1");
      } else if (game.player2 === user) {
        setPlayerRole("player2");
      } else {
        setPlayerRole(null);
      }
    }
  }, [game, user]);


  useEffect(() => {
    if (game && user) {
      if (game.player1 === user && !game.player1Ready) {
        navigate(`/setup/${game._id}`);
      } else if (game.player2 === user && !game.player2Ready) {
        navigate(`/setup/${game._id}`);
      }
    }
  }, [game, user]);
  

  const handleAttack = async (index) => {

    // console.log("⚔️ Attacking index:", index);
    // if (!playerRole) return;
    if (!isYourTurn || winner || !playerRole) return;
    if ((yourHits || []).includes(index)) return;

    const opponentHits = playerRole === "player1" ? game.player1Hits : game.player2Hits;
    if (opponentHits.includes(index)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/games/${id}/move`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      const updated = await res.json();
      setGame(updated);
    } catch (err) {
      console.error("Attack failed:", err);
    }
  };

  if (loading) return <div>Loading game...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!game || !playerRole) return <div>Waiting for data...</div>;

  const yourBoard = playerRole === "player1" ? game.player1Board : game.player2Board;
  const yourHits = playerRole === "player1" ? game.player1Hits : game.player2Hits;
  const yourMisses = playerRole === "player1" ? game?.player1Misses || [] : game?.player2Misses || [];

  const enemyBoard = playerRole === "player1" ? game.player2Board : game.player1Board;
  const enemyHits = playerRole === "player1" ? game.player2Hits : game.player1Hits;

  const isYourTurn = game?.currentTurn === playerRole;
  const winner = game?.winner;

  // console.log("💧 yourMisses:", yourMisses);

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>Online Game</h2>
        {/* {winner && <h3 className="game-over">{winner} Wins!</h3>}
        {!winner && <h3>{isYourTurn ? "Your Turn!" : "Opponent's Turn"}</h3>} */}
        {!playerRole ? (
          <h3 className="not-your-game">Not your game</h3>
        ) : winner ? (
          <h3 className="game-over">{winner} Wins!</h3>
        ) : isYourTurn ? (
          <h3 className="your-turn">Your Turn!</h3>
        ) : (
          <h3 className="waiting-turn">Opponent's Turn</h3>
        )}

        <div className="boards-container">
        <div>
            <h3>Opponent Board</h3>
            <div className="game-board">
              {Array(TILE_COUNT).fill(0).map((_, i) => (
                <Tile
                  key={i}
                  isHit={yourHits.includes(i)}
                  isMiss={yourMisses.includes(i)}
                  isDisabled={!isYourTurn || winner}
                  onClick={() => handleAttack(i)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3>Your Board</h3>
            <div className="game-board">
              {Array(TILE_COUNT).fill(0).map((_, i) => (
                <Tile
                  key={i}
                  isShip={yourBoard.includes(i)}
                  isHit={enemyHits.includes(i)}
                  // isMiss={yourMisses.includes(i)}
                  isDisabled={true}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LiveGame;
