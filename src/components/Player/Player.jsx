import React, {useContext, useState}from 'react';
import { GameContext } from '../../App';
import "./Player.css"


export default function Player() {
  const playername = useContext(GameContext)
  const { playerName, setPlayerName } = playername
  const [showInput, setShowInput] = useState(true);

  const handleNameChange = (name) => {
    setPlayerName(name);
  };

  const handleSubmit = () => {
    setShowInput(false);
  };

  return (
    <div className="playerContainer">
      <h1>Welcome to the Card Playing Game</h1>
      {showInput && (
        <div className='nameInput'>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => handleNameChange(e.target.value)}
          />
          <button className='submitBtn' onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {!showInput && <h2>Hello, {playerName}!</h2>}
    </div>
  );
}