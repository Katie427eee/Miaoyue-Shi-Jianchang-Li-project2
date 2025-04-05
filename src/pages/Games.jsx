import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

  if (loading) return <div className="game-page"><h2>Loading games...</h2></div>;
  if (!gamesData) return <div className="game-page"><h2>Error loading games.</h2></div>;

  return (
    <div className="game-page">
      <div className="content-wrapper">
        <h2>All Games</h2>

        {gamesData.loggedIn ? (
          <>
            <section>
              <h3>Active Games</h3>
              <ul>
                {gamesData.activeGames.map((g) => (
                  <li key={g._id}>
                    {g.player1} vs {g.player2} ！ {formatDate(g.createdAt)} ！ 
                    <button onClick={() => navigate(`/game/${g._id}`)}>Play</button>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Completed Games</h3>
              <ul>
                {gamesData.completedGames.map((g) => (
                  <li key={g._id}>
                    {g.player1} vs {g.player2} ！ Winner: <b>{g.winner}</b> ！
                    {formatDate(g.createdAt)} ~ {formatDate(g.updatedAt)}
                    <button onClick={() => navigate(`/game/${g._id}`)}>View</button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <>
            <section>
              <h3>Open Games</h3>
              <ul>
                {gamesData.openGames.map((g) => (
                  <li key={g._id}>
                    Started by {g.player1} ！ {formatDate(g.createdAt)} ！
                    <button onClick={() => navigate(`/game/${g._id}`)}>Join</button>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>My Open Games</h3>
              <ul>
                {gamesData.myOpenGames.map((g) => (
                  <li key={g._id}>
                    You started ！ {formatDate(g.createdAt)} ！
                    <button onClick={() => navigate(`/game/${g._id}`)}>View</button>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>My Active Games</h3>
              <ul>
                {gamesData.myActiveGames.map((g) => (
                  <li key={g._id}>
                    With {g.player2 || g.player1} ！ {formatDate(g.createdAt)} ！
                    <button onClick={() => navigate(`/game/${g._id}`)}>Play</button>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>My Completed Games</h3>
              <ul>
                {gamesData.myCompletedGames.map((g) => (
                  <li key={g._id}>
                    Opponent: {g.player1 === g.winner ? g.player2 : g.player1} ！ Winner: <b>{g.winner}</b> ！
                    {formatDate(g.createdAt)} ~ {formatDate(g.updatedAt)} ！
                    <button onClick={() => navigate(`/game/${g._id}`)}>View</button>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Other Games</h3>
              <ul>
                {gamesData.otherGames.map((g) => (
                  <li key={g._id}>
                    {g.player1} vs {g.player2} ！ 
                    {g.winner ? <>Winner: <b>{g.winner}</b> ！</> : null}
                    {formatDate(g.createdAt)} ~ {formatDate(g.updatedAt)} ！
                    <button onClick={() => navigate(`/game/${g._id}`)}>View</button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Games;
