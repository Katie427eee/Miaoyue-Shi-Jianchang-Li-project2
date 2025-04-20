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

// POST /api/games
router.post("/", async (req, res) => {
  const username = getUsernameFromToken(req);
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const newGame = new Game({ 
      player1: username,
      currentTurn:"player1", 
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    console.error("Error creating game:", err);
    res.status(500).json({ error: "Failed to create game" });
  }
});


// PUT /api/games/:id/board
router.put("/:id/board", async (req, res) => {
  console.log("📩 PUT /:id/board reached with id:", req.params.id);

  const username = getUsernameFromToken(req);
  const { board } = req.body;

  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    if (username === game.player1) {
      game.player1Board = board;
      game.player1Ready = true;
    } else if (username === game.player2) {
      game.player2Board = board;
      game.player2Ready = true;
    } else {
      return res.status(403).json({ error: "Not your game" });
    }

    await game.save();
    res.json(game);
  } catch (err) {
    console.error("Error setting board:", err);
    res.status(500).json({ error: "Failed to set board" });
  }
});


// PUT /api/games/:id/join
router.put("/:id/join", async (req, res) => {
  const username = getUsernameFromToken(req);
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const game = await Game.findById(req.params.id);
    if (!game || game.player2) {
      return res.status(400).json({ error: "Game not joinable" });
    }
    game.player2 = username;
    game.updatedAt = new Date();
    await game.save();

    res.json(game);
  } catch (err) {
    console.error("Error joining game:", err);
    res.status(500).json({ error: "Failed to join game" });
  }
});

// GET /api/games/:id
// router.get("/:id", async (req, res) => {
//   try {
//     const game = await Game.findById(req.params.id);
//     if (!game) return res.status(404).json({ error: "Game not found" });

//     res.json(game);
//   } catch (err) {
//     console.error("Error fetching game:", err);
//     res.status(500).json({ error: "Failed to fetch game" });
//   }
// });

// GET /api/games/:id
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    const token = req.cookies.token;
    let username = null;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      username = decoded.username;
    } catch (err) {
      console.log("? Invalid token in GET /games/:id");
    }

    const isPlayer1 = game.player1 === username;
    const isPlayer2 = game.player2 === username;

    if (!username || (!isPlayer1 && !isPlayer2)) {
      return res.json({
        _id: game._id,
        player1: game.player1,
        player2: game.player2,
        player1Hits: game.player1Hits,
        player2Hits: game.player2Hits,
        isAI: game.isAI,
        winner: game.winner,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
      });
    }

    return res.json(game);
  } catch (err) {
    console.error("Error fetching game:", err);
    res.status(500).json({ error: "Failed to fetch game" });
  }
});

// PUT /api/games/:id/move
router.put("/:id/move", async (req, res) => {
  const username = getUsernameFromToken(req);
  // const { index } = req.body;
  const index = parseInt(req.body.index, 10);

  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    const isPlayer1 = game.player1 === username;
    const isPlayer2 = game.player2 === username;

    if (!isPlayer1 && !isPlayer2)
      return res.status(403).json({ error: "Not your game!" });

    const isTurn =
      (game.currentTurn === "player1" && isPlayer1) ||
      (game.currentTurn === "player2" && isPlayer2);

    if (!isTurn) return res.status(400).json({ error: "Not your turn!" });

    const opponentBoard = isPlayer1 ? game.player2Board : game.player1Board;
    // const hitsArray = isPlayer1 ? game.player1Hits : game.player2Hits;
    // const missesArray = isPlayer1 ? game.player1Misses : game.player2Misses;
    const hitsArray = isPlayer1 ? game.player1Hits || [] : game.player2Hits || [];
    const missesArray = isPlayer1 ? game.player1Misses || [] : game.player2Misses || [];

    if (hitsArray.includes(index) || missesArray.includes(index))
      return res.status(400).json({ error: "Already attacked" });

    if (opponentBoard.includes(index)) {
      console.log(`HIT recorded for ${username} at index: ${index}`);
      hitsArray.push(index);
    } else{
      missesArray.push(index);
    }

    // all sunk?
    const allSunk = opponentBoard.every((pos) =>
      (isPlayer1 ? game.player1Hits : game.player2Hits).includes(pos)
    );

    if (allSunk) {
      game.winner = username;
    } else {
      game.currentTurn = isPlayer1 ? "player2" : "player1";
    }

    game.updatedAt = new Date();
    await game.save();
    res.json(game);
  } catch (err) {
    console.error("Error handling move:", err);
    res.status(500).json({ error: "Failed to process move" });
  }
});


// POST /api/games/ai 
router.post("/ai", async (req, res) => {
  const username = getUsernameFromToken(req);
  if (!username) return res.status(401).json({ error: "Unauthorized" });

  try {
    const newGame = new Game({
      player1: username,
      player2: "AI",
      isAI: true,
      currentTurn: "player1"
      // player2Board: generateRandomBoard()
    });

  
    const generateRandomBoard = () => {
      const shipSizes = [5, 4, 3, 3, 2];
      const board = [];
      const occupied = new Set();

      for (const size of shipSizes) {
        let placed = false;
        while (!placed) {
          const vertical = Math.random() > 0.5;
          const start = Math.floor(Math.random() * 100);
          const positions = [];

          let valid = true;
          for (let i = 0; i < size; i++) {
            const index = vertical ? start + i * 10 : start + i;
            if (index >= 100 || occupied.has(index)) {
              valid = false;
              break;
            }
            if (!vertical && Math.floor(index / 10) !== Math.floor(start / 10)) {
              valid = false;
              break;
            }
            positions.push(index);
          }

          if (valid) {
            positions.forEach(p => occupied.add(p));
            board.push(...positions);
            placed = true;
          }
        }
      }

      return board;
    };

    newGame.player2Board = generateRandomBoard();

    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    console.error("Error creating AI game:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
