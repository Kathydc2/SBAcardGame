import React, { useContext, useState, useEffect, useReducer } from 'react';
import { GameContext } from '../../App';
import './Game.css';


const initialState = {
  playerScore: 0,
  computerScore: 0,
  gameStarted: false,
  cardsRemaining: 52,
  playerCards: [], 
  computerCards: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATESCORE':
      return {
        ...state,
        playerScore: action.playerScore,
        computerScore: action.computerScore,
        currentCardIndex: state.currentCardIndex + 1,
        cardsRemaining: state.cardsRemaining - 1,
      };
    default:
      return state;
  }
};



export default function Game({ playerCards = [], computerCards = [], setComputerCards, setPlayerCards}) {
  const playername = useContext(GameContext);
  const { playerName } = playername;
  const [gameStarted, setGameStarted] = useState(false);
  const [cardsRemaining, setCardsRemaining] = useState(52);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gameResult, setGameResult] = useState("");


  useEffect(() => {
    // console.log("Received playerCards in Game.jsx", playerCards);
    // console.log("Received computerCards in Game.jsx", computerCards);
  }, [playerCards, computerCards]);

  const drawCard = () => {
    if (gameStarted && cardsRemaining > 0) {

      const playerCard = playerCards[currentCardIndex];
      const computerCard = computerCards[currentCardIndex];

      const playerCardValue = getValue(playerCard.value);
      const computerCardValue = getValue(computerCard.value);

      let playerScore = state.playerScore;
      let computerScore = state.computerScore;

      if (playerCardValue > computerCardValue) {
        playerScore += 1;
      } else if (playerCardValue < computerCardValue) {
        computerScore += 1;
      }

      dispatch({ type: 'UPDATESCORE', playerScore, computerScore });

      setCurrentCardIndex(currentCardIndex + 1);
      setCardsRemaining(cardsRemaining - 1);

      if (currentCardIndex + 1 >= playerCards.length || currentCardIndex + 1 >= computerCards.length) {
        endGame();
      }
    }

  };

  const endGame = () => {
    setGameStarted(false);
    setCardsRemaining(52);
    setCurrentCardIndex(0);
    if (state.playerScore > state.computerScore) {
      setGameResult(`${playerName} Wins!`);
    } else if (state.computerScore > state.playerScore) {
      setGameResult("Computer Wins!");
    } else {
      setGameResult("It's a Tie!");
    }
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const newGame = () => {
    // Refresh the page
    window.location.reload();
  };

  const getValue = (value) => {
    // convert the values with strings into numbers
    switch (value) {
      case 'ACE':
        return 14;
      case 'KING':
        return 13;
      case 'QUEEN':
        return 12;
      case 'JACK':
        return 11;
      default:
        return parseInt(value);
    }
  };

  return (
    <div className='gameContainer'>
       
         <div className='btnContainer'>
         <button className='gameBtn' onClick={newGame}>Restart</button>
        <button className='gameBtn' onClick={() => { setGameStarted(true); drawCard(); }}>Draw Card</button>
        <button className='gameBtn' onClick={endGame}>End Game</button>
      </div>
      {/* <div className='nameBoard'>
        <div className='displayName'>{playerName}</div>
        <div className='displayName'>Computer</div>
      </div> */}
          <div className='scoreBoard'>
            <h1>Score</h1>
            <p>{playerName}: {state.playerScore}</p>
            <p>Computer: {state.computerScore}</p>
          </div>
      <div className='gameBoard'>
      <img className="placeHolder" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder"/>
      {gameStarted && (
        <>
          <div>
            <h2>{playerName}'s Card</h2>
            {playerCards.length > 0 && currentCardIndex < playerCards.length && (
              <img src={playerCards[currentCardIndex].image} alt={`Player's Card`} />
            )}
          </div>
          <hr></hr>
          <div>
            <h2>Computer's Card</h2>
            {computerCards.length > 0 && currentCardIndex < computerCards.length && (
              <img src={computerCards[currentCardIndex].image} alt={`Computer's Card`} />
            )}
          </div>
        
        </>
      )}
      {!gameStarted && gameResult && (
        <div>
          <h2>{gameResult}</h2>
        </div>
      )}
      <img className="placeHolder" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder"/>
      </div>
    </div>
  );
}




