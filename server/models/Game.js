const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  player1: String,
  player2: String, // null
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  winner: String, // null
}, { timestamps: true });

module.exports = mongoose.model("Game", GameSchema);
