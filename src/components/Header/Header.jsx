import React, {useContext, useState}from 'react';
import { GameContext } from '../../App';
import "./Header.css"


export default function Header() {
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
    <div className="headerContainer">
      <h1 className='title'>War Card Game</h1>
      {showInput && (
        <div>
          <input
            class="nameInput"
            type="text"
            name="text"
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