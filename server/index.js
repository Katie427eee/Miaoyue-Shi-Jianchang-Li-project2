const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const gamesRoutes = require("./routes/games");
const scoresRoutes = require("./routes/scores");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/scores", scoresRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("? MongoDB connected");
    app.listen(5000, () => console.log("? Server running on http://localhost:5000"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
