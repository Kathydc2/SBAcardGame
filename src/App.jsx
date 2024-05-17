import './App.css';
import React , { useState, createContext} from 'react';
import Game from './components/Game/Game';
import Player from './components/Player/Player';


export const GameContext = createContext();
export default function App() {
  const [playerName, setPlayerName] = useState('');

  return (
    <div className="App">
      
      <GameContext.Provider value={{ playerName, setPlayerName}}>
        <Player/>
      
        <Game />
      </GameContext.Provider>
    </div>
  );
}
