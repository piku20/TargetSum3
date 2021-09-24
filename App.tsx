import React, {useState} from "react";
import {
  StyleSheet,
  View,
} from 'react-native';

import Game from './src/game';

const App = ()=>{
  
  const [gameId, setGameId] = useState(1);

  const resetGame = ()=>{
    setGameId(prevId => prevId+1)
  }
  
  return(    
    <Game
      key = {gameId}
      randomNumberCount = {6}
      initialSeconds = {10}
      onPlayAgain = {resetGame}
    />
  );
}

export default App;