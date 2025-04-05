import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/games.css";

const Games = () => {
  const { user } = useAuth();
  const [gamesData, setGamesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/games", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setGamesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (d) => new Date(d).toLocaleString();

  const renderGameItem = (g, label = "View") => (
    <li key={g._id} className="game-item">
      <div className="game-info">
        <div>
          {g.player1 === user ? <span className="highlight">{g.player1}</span> : g.player1} vs{" "}
          {g.player2 === user ? <span className="highlight">{g.player2}</span> : g.player2 || "?"}
        </div>
        <div className="game-meta">
          {g.winner && <>? Winner: <b>{g.winner}</b><br /></>}
          ? {formatDate(g.createdAt)} ~ {formatDate(g.updatedAt || g.createdAt)}
        </div>
      </div>
      <button onClick={() => navigate(`/game/${g._id}`)}>{label}</button>
    </li>
  );

  const renderSection = (title, games, label) =>
    games?.length > 0 && (
      <section>
        <h3>{title}</h3>
        <ul>{games.map((g) => renderGameItem(g, label))}</ul>
      </section>
    );

  if (loading) return <div className="game-page"><h2>Loading games...</h2></div>;
  if (!gamesData) return <div className="game-page"><h2>Error loading games.</h2></div>;

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>All Games</h2>
        {renderSection("Open Games", gamesData.openGames, "Join")}
        {renderSection("My Open Games", gamesData.myOpenGames, "View")}
        {renderSection("My Active Games", gamesData.myActiveGames, "Play")}
        {renderSection("My Completed Games", gamesData.myCompletedGames, "View")}
        {renderSection("Other Games", gamesData.otherGames, "View")}
      </div>
    </div>
  );
};

export default Games;
