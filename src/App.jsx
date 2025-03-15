// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EasyGame from "./pages/EasyGame";
import NormalGame from "./pages/NormalGame";
import Rules from "./pages/Rules";
import HighScores from "./pages/HighScores";
import Navbar from "./components/Navbar";
import PlayerSetup from "./pages/PlayerSetup";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/easy" element={<EasyGame />} />
        <Route path="/game/normal" element={<NormalGame />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/highscores" element={<HighScores />} />
        <Route path="/setup" element={<PlayerSetup />} />
      </Routes>
    </>
  );
};

export default App;
