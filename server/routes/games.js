const express = require("express");
const jwt = require("jsonwebtoken");
const Game = require("../models/Game");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to extract username from JWT token in cookie
const getUsernameFromToken = (req) => {
  const token = req.cookies.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("? decoded from JWT:", decoded);
    return decoded.username;
  } catch (err) {
    console.log("? Token decode error:", err);
    return null;
  }
};

// GET /api/games
router.get("/", async (req, res) => {
  const username = getUsernameFromToken(req);
  console.log("? token from cookie:", req.cookies.token);
  console.log("? parsed username:", username);

  try {
    const allGames = await Game.find({}).sort({ createdAt: -1 });

    const openGames = allGames.filter(
      (g) => g.player1 && !g.player2 && g.player1 !== username
    );

    const myOpenGames = allGames.filter(
      (g) => g.player1 === username && !g.player2
    );

    const myActiveGames = allGames.filter(
      (g) =>
        (g.player1 === username || g.player2 === username) &&
        g.player1 &&
        g.player2 &&
        !g.winner
    );

    const myCompletedGames = allGames.filter(
      (g) =>
        (g.player1 === username || g.player2 === username) &&
        g.winner
    );

    const otherGames = allGames.filter(
      (g) =>
        g.player1 !== username &&
        g.player2 !== username &&
        ((g.player1 && g.player2 && !g.winner) || g.winner)
    );

    return res.json({
      loggedIn: !!username,
      openGames,
      myOpenGames,
      myActiveGames,
      myCompletedGames,
      otherGames,
    });
  } catch (err) {
    console.error("Error loading games:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
