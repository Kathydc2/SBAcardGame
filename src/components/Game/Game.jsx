import React ,{useContext, useState }from 'react';
import { GameContext } from '../../App';
import "./Game.css"

export default function Game({playerCards = [], computerCards = []}) {
    const playername = useContext(GameContext)
    const { playerName } = playername
    const [gameStarted, setGameStarted] = useState(false);
    const [cardsRemaining, setCardsRemaining] = useState(52);

    const startGame = () => {
      setGameStarted(true);
    };
    
      const drawCard = () => {
        if (gameStarted && cardsRemaining > 0) {
          // Logic to draw a card
          setCardsRemaining(cardsRemaining - 1);
        }
      };
    
      const endGame = () => {
        setGameStarted(false);
        setCardsRemaining(52); 
      };
    
  return (
    <div className='gameContainer'>
      
      <div className='gameBoard'>
        <div className='displayName'>{playerName}</div>
        <div className='displayName'>Computer</div>
      </div>
      <div className='btnContainer'>
        <button className='gameBtn' onClick={startGame}>Start Game</button>
        <button className='gameBtn' onClick={drawCard}>Draw</button>
        <button className='gameBtn' onClick={endGame}>End Game</button>
        {/* Add game logic here */}
      </div>
      {gameStarted && (
        <>
          <div>
            <h2>Player Cards</h2>
            {playerCards.length > 0 ? (
              <ul>
                {playerCards.map((card, index) => (
                  <li key={index}>{card.value} of {card.suit}</li>
                ))}
              </ul>
            ) : (
              <p>No cards available.</p>
            )}
          </div>
          <div>
            <h2>Computer Cards</h2>
            {computerCards.length > 0 ? (
              <ul>
                {computerCards.map((card, index) => (
                  <li key={index}>{card.value} of {card.suit}</li>
                ))}
              </ul>
            ) : (
              <p>No cards available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

