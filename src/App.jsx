import './App.css';
import React , { useState, createContext} from 'react';
import Player from './components/Player/Player';
import Card from './components/Card/Card'


export const GameContext = createContext();
export default function App() {
  const [playerName, setPlayerName] = useState('Player');
  const [playerCards, setPlayerCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);

  return (
    <div className="App">
      <GameContext.Provider value={{ playerName, setPlayerName}}>
        <Player/>
        <Card playerCards={playerCards} computerCards={computerCards} setPlayerCards={setPlayerCards} setComputerCards={setComputerCards} />
      </GameContext.Provider>
    </div>
  );
}
