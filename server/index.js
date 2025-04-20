const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); // 必须放在顶部！

const gamesRoutes = require("./routes/games");
const scoresRoutes = require("./routes/scores");
const authRoutes = require("./routes/auth");

const app = express();

// Dynamic CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/scores", scoresRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

console.log("Connecting to Mongo:", MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("? MongoDB connected");
    app.listen(PORT, () => {
      console.log(`? Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("? MongoDB connection error:", err));
