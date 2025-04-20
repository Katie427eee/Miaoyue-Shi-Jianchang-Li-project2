import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/common.css";
import "../styles/games.css";

const formatDate = (d) => new Date(d).toLocaleString();

const Games = () => {
  const { user } = useAuth();
  const [gamesData, setGamesData] = useState({
    openGames: [],
    myOpenGames: [],
    myActiveGames: [],
    myCompletedGames: [],
    otherGames: [],
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/games", {
          credentials: "include",
        });
        const data = await res.json();

        // filter
        const cleanData = {
          openGames: data.openGames.filter((g) => !g.isAI),
          myOpenGames: data.myOpenGames.filter((g) => !g.isAI),
          myActiveGames: data.myActiveGames.filter((g) => !g.isAI),
          myCompletedGames: data.myCompletedGames.filter((g) => !g.isAI),
          otherGames: data.otherGames.filter((g) => !g.isAI),
        };

        setGamesData(cleanData);
      } catch (err) {
        console.error("Failed to fetch games:", err);
      }
    };

    fetchGames();
  }, []);

  // useEffect(() => {
  //   const fetchGames = async () => {
  //     try {
  //       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/games`, {
  //         credentials: "include",
  //       });
  //       const data = await res.json();
  //       // ...
  //     } catch (err) {
  //       console.error("Failed to fetch games:", err);
  //     }
  //   };
  
  //   fetchGames();
  // }, []);

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
      <button onClick={() => navigate(`/game/view/${g._id}`)}>{label}</button>
    </li>
  );

  // const renderSection = (title, games, label) =>
  //   games?.length > 0 && (
  //     <section>
  //       <h3>{title}</h3>
  //       <ul>{games.map((g) => renderGameItem(g, label))}</ul>
  //     </section>
  //   );

  // if (loading) return <div className="game-page"><h2>Loading games...</h2></div>;
  // if (!gamesData) return <div className="game-page"><h2>Error loading games.</h2></div>;

  const renderSection = (title, games, actionLabel, customAction) => {
    if (!games || games.length === 0) return null;
  
    return (
      <section>
        <h3>{title}</h3>
        <ul>
          {games.map((g) => (
            <li key={g._id} className="game-item">
              <div className="game-info">
                <div>
                  {g.player1} vs {g.player2 || "Waiting..."}
                </div>
                {g.winner && (
                  <div className="game-meta">
                    Winner: <b>{g.winner}</b><br />
                    {formatDate(g.createdAt)} ~ {formatDate(g.updatedAt || g.createdAt)}
                  </div>
                )}
                {!g.winner && (
                  <div className="game-meta">
                    {formatDate(g.createdAt)}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate(
                      actionLabel === "View"
                        ? `/game/view/${g._id}`
                        : `/game/${g._id}`
                    )
                  }
                >
                  {actionLabel}
                </button>
                {customAction && <button onClick={customAction}>Challenge AI</button>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  };


  const challengeAI = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/games/ai", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data._id) {
        navigate(`/game/ai/${data._id}`);
      } else {
        alert("Failed to start AI game.");
      }
    } catch (err) {
      console.error("Error starting AI game:", err);
      alert("Server error.");
    }
  };

  const joinGame = async (gameId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/games/${gameId}/join`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data._id) {
        navigate(`/game/${data._id}`);
      } else {
        alert(data.error || "Failed to join game");
      }
    } catch (err) {
      console.error("Join error:", err);
      alert("Server error when joining game");
    }
  };
  

  return (
    <div className="game-page">
      <Navbar />
      <div className="background"></div>
      <div className="content-wrapper">
        <h2>All Games</h2>
        
        {/* {renderSection("Open Games", gamesData.openGames, "Join")} */}
        {gamesData.openGames?.length > 0 && (
          <section>
            <h3>Open Games</h3>
            <ul>
              {gamesData.openGames.map((g) => (
                <li key={g._id} className="game-item">
                  <div className="game-info">
                    <div>{g.player1} vs ?</div>
                    <div className="game-meta">{formatDate(g.createdAt)}</div>
                  </div>
                  <div>
                    <button onClick={() => joinGame(g._id)}>Join</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
  

        {/* {renderSection("My Open Games", gamesData.myOpenGames, "View")} */}
        {gamesData.myOpenGames?.length > 0 && (
          <section>
            <h3>My Open Games</h3>
            <ul>
              {gamesData.myOpenGames.map((g) => (
                <li key={g._id} className="game-item">
                  <div className="game-info">
                    <div>{g.player1}</div>
                    <div className="game-meta">{formatDate(g.createdAt)}</div>
                  </div>
                  <div>
                  <button onClick={() => navigate(`/game/view/${g._id}`)}>View</button>
                    <button onClick={challengeAI}>Challenge AI</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {renderSection("My Active Games", gamesData.myActiveGames, "Play")}
        {renderSection("My Completed Games", gamesData.myCompletedGames, "View")}
        {renderSection("Other Games", gamesData.otherGames, "View")}
      </div>
    </div>
  );

};

export default Games;


