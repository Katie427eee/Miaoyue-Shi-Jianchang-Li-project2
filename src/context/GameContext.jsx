import React, { createContext, useContext, useEffect, useReducer } from "react";

// const initialEasyState = {
//     board: Array(100).fill(null),
//     ships: [],
//     hits: [],
//     misses: [],
//     gameOver: false,
//     timer: 0
//   };
  
  const initialNormalState = {
    playerBoard: Array(100).fill(null),
    enemyBoard: Array(100).fill(null),
    playerShips: [],
    enemyShips: [],
    //enemyShips: generateShips(),
    playerHits: [],
    enemyHits: [],
    playerMisses: [],
    enemyMisses: [],
    gameOver: false,
    timer: 0,
    playerTurn: true,
    lastHit: null,
    hitStack: [],
  };
  
  // `EasyGame` 
  // const loadEasyState = () => {
  //   try {
  //     const savedState = localStorage.getItem("easyGameState");
  //     return savedState ? { ...initialEasyState, ...JSON.parse(savedState) } : initialEasyState;
  //   } catch (error) {
  //     console.error("Error loading EasyGame state from localStorage:", error);
  //     return initialEasyState;
  //   }
  // };
  
  // `NormalGame`
  const loadNormalState = () => {
    try {
      const savedState = localStorage.getItem("normalGameState");
      return savedState ? { ...initialNormalState, ...JSON.parse(savedState) } : initialNormalState;
    } catch (error) {
      console.error("Error loading NormalGame state from localStorage:", error);
      return initialNormalState;
    }
  };
  
  // `EasyGame` Reducer
  // const easyGameReducer = (state, action) => {
  //   switch (action.type) {
  //     case "SET_GAME_STATE":
  //       return { ...state, ...action.payload };
  //     case "SET_HIT":
  //       return { ...state, hits: [...state.hits, action.payload] };
  //     case "SET_MISS":
  //       return { ...state, misses: [...state.misses, action.payload] };
  //     case "SET_GAME_OVER":
  //       return { ...state, gameOver: true };
  //     case "RESET_GAME":
  //       return initialEasyState;
  //     default:
  //       return state;
  //   }
  // };
  
  // `NormalGame` Reducer
  const normalGameReducer = (state, action) => {
    switch (action.type) {
      case "SET_GAME_STATE":
        return { ...state, ...action.payload };
      case "SET_HIT_PLAYER":
        return { ...state, playerHits: [...state.playerHits, action.payload] };
      case "SET_HIT_ENEMY":
        return { ...state, enemyHits: [...state.enemyHits, action.payload] };
      case "SET_MISS_PLAYER":
        return { ...state, playerMisses: [...state.playerMisses, action.payload] };
      case "SET_MISS_ENEMY":
        return { ...state, enemyMisses: [...state.enemyMisses, action.payload] };
      case "SET_GAME_OVER":
        return { ...state, gameOver: true };
      case "RESET_GAME":
        return initialNormalState;
      default:
        return state;
    }
  };
  
  // `GameContext`
  export const GameContext = createContext();
  
  // `GameProvider` 
  export const GameProvider = ({ children }) => {
    // const [easyState, easyDispatch] = useReducer(easyGameReducer, loadEasyState());
    const [normalState, normalDispatch] = useReducer(normalGameReducer, loadNormalState());
  
    // `EasyGame' `localStorage` update
    // useEffect(() => {
    //   if (!easyState.gameOver){
    //     localStorage.setItem("easyGameState", JSON.stringify(easyState));
    //   } else{
    //     localStorage.removeItem("easyGameState");
    //   }
    // }, [easyState]);
  
    // `NormalGame`  `localStorage` update
    useEffect(() => {
      if (!normalState.gameOver){
        localStorage.setItem("normalGameState", JSON.stringify(normalState));
      } else{
        localStorage.removeItem("normalGameState");
      }
    }, [normalState]);

    const startNewMultiplayerGame = async (navigate) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/games`, {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        if (data._id) {
          navigate(`/game/${data._id}`);
        } else {
          alert("Failed to create new game.");
        }
      } catch (err) {
        console.error("Error creating game:", err);
      }
    };
  
    return (
      // <GameContext.Provider value={{ easyState, easyDispatch, normalState, normalDispatch }}>
      <GameContext.Provider value={{ normalState, normalDispatch, startNewMultiplayerGame }}>
        {children}
      </GameContext.Provider>
    );
  };
  
  // Hook
  export const useGame = () => {
    return useContext(GameContext);
  };