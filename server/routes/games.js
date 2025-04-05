const express = require("express");
const jwt = require("jsonwebtoken");
const Game = require("../models/Game");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

const getUsernameFromToken = (req) => {
  const token = req.cookies.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.username;
  } catch (err) {
    return null;
  }
};

// GET /api/games
router.get("/", async (req, res) => {
  const token = req.cookies.token;
  console.log("? token from cookie:", token);

  const username = getUsernameFromToken(req);
  console.log("? parsed username:", username);

  try {
    const allGames = await Game.find({}).sort({ createdAt: -1 });

    if (username) {
      const activeGames = allGames.filter(
        (g) => g.player1 && g.player2 && !g.winner &&
               (g.player1 === username || g.player2 === username)
      );

      const completedGames = allGames.filter(
        (g) => g.winner &&
              (g.player1 === username || g.player2 === username)
      );

      return res.json({
        loggedIn: true,
        activeGames,
        completedGames,
      });
    } else {
      const openGames = allGames.filter(
        (g) => g.player1 && !g.player2
      );

      const myOpenGames = allGames.filter(
        (g) => g.player1 === "guest" && !g.player2
      );

      const myActiveGames = allGames.filter(
        (g) => (g.player1 === "guest" || g.player2 === "guest") && !g.winner
      );

      const myCompletedGames = allGames.filter(
        (g) => (g.player1 === "guest" || g.player2 === "guest") && g.winner
      );

      const otherGames = allGames.filter(
        (g) =>
          g.player1 !== "guest" &&
          g.player2 !== "guest" &&
          (g.player1 && g.player2) &&
          (g.winner || !g.winner)
      );

      return res.json({
        loggedIn: false,
        openGames,
        myOpenGames,
        myActiveGames,
        myCompletedGames,
        otherGames,
      });
    }
  } catch (err) {
    console.error("Error loading games:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
