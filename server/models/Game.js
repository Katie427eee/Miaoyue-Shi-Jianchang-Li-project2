const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  player1: String,
  player2: String, // null

  player1Board: { type: [Number], default: [] }, 
  player2Board: { type: [Number], default: [] },
  player1Hits: { type: [Number], default: [] },
  player2Hits: { type: [Number], default: [] },
  player1Misses: { type: [Number], default: [] },
  player2Misses: { type: [Number], default: [] },
  currentTurn: { type: String }, // 'player1' or 'player2'
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  winner: String, 

  player1Ready: { type: Boolean, default: false },
  player2Ready: { type: Boolean, default: false },
  
  isAI: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Game", GameSchema);
