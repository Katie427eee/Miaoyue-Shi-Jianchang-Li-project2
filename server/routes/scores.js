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
  } catch {
    return null;
  }
};

router.get("/", async (req, res) => {
  const currentUser = getUsernameFromToken(req);

  try {
    const games = await Game.find({ winner: { $ne: null } });

    const scores = {};

    games.forEach((game) => {
      const { player1, player2, winner } = game;

      [player1, player2].forEach((p) => {
        if (!scores[p]) {
          scores[p] = { wins: 0, losses: 0 };
        }
      });

      scores[winner].wins += 1;
      const loser = winner === player1 ? player2 : player1;
      scores[loser].losses += 1;
    });

    const scoreList = Object.entries(scores).map(([username, stats]) => ({
      username,
      wins: stats.wins,
      losses: stats.losses,
    }));

    scoreList.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (a.losses !== b.losses) return a.losses - b.losses;
      return a.username.localeCompare(b.username);
    });

    return res.json({ scores: scoreList, currentUser });
  } catch (err) {
    console.error("Error loading scores:", err);
    res.status(500).json({ error: "Failed to load scores" });
  }
});

module.exports = router;
