import React, { useContext, useState, useEffect, useReducer } from 'react';
import { GameContext } from '../../App';
import './Game.css';


const initialState = {
  playerScore: 0,
  computerScore: 0,
  gameStarted: false,
  cardsRemaining: 52,
  currentCardIndex: 0, // Initialize currentCardIndex
  playerCards: [], 
  computerCards: [],
  war: false,
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
      case 'DECLAREWAR':
        console.log("War declared...");
        return {
          ...state,
          war: true,
        };
        case 'RESOLVEWAR':
          console.log("Resolving war...");
          console.log("Current index:", state.currentCardIndex);
          console.log("Player cards length:", state.playerCards.length);
          console.log("Computer cards length:", state.computerCards.length);


          const currentCardIndex = typeof state.currentCardIndex === 'number' ? state.currentCardIndex : 0;
          const playerCards = state.playerCards.slice(state.currentCardIndex, state.currentCardIndex + 4);
          const computerCards = state.computerCards.slice(state.currentCardIndex, state.currentCardIndex + 4);
    
          if (playerCards.length < 4 || computerCards.length < 4) {
            console.log("Not enough cards for war");
            return state; // Not enough cards for war
          }
    
          const playerFourthCardValue = getValue(playerCards[3].value);
          const computerFourthCardValue = getValue(computerCards[3].value);
    
          let newPlayerScore = state.playerScore;
          let newComputerScore = state.computerScore;
    
          if (playerFourthCardValue > computerFourthCardValue) {
            newPlayerScore += 8;
          } else if (playerFourthCardValue < computerFourthCardValue) {
            newComputerScore += 8;
          }

          console.log("New scores:", newPlayerScore, newComputerScore);
    
          return {
            ...state,
            playerScore: newPlayerScore,
            computerScore: newComputerScore,
            currentCardIndex: currentCardIndex + 4,
            cardsRemaining: state.cardsRemaining - 4,
            war: false,
          };
        default:
          return state;
      }
    };;
  



export default function Game({ playerCards = [], computerCards = [], setComputerCards, setPlayerCards}) {
  const playername = useContext(GameContext);
  const { playerName } = playername;
  const [gameStarted, setGameStarted] = useState(false);
  const [cardsRemaining, setCardsRemaining] = useState(52);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [state, dispatch] = useReducer(reducer, {...initialState, playerCards,computerCards});
  const [gameResult, setGameResult] = useState("");

  useEffect(() => {
    if (state.war) {
      setTimeout(() => {
        dispatch({ type: 'RESOLVEWAR' });
      }, 2000); // Wait for the animation to complete
    }
  }, [state.war]);

  const drawCard = () => {
    if (gameStarted && cardsRemaining > 0) {

      const playerCard = playerCards[state.currentCardIndex];
      const computerCard = computerCards[state.currentCardIndex];

      const playerCardValue = getValue(playerCard.value);
      const computerCardValue = getValue(computerCard.value);

      let playerScore = state.playerScore;
      let computerScore = state.computerScore;

      if (playerCardValue > computerCardValue) {
        playerScore += 1;
      } else if (playerCardValue < computerCardValue) {
        computerScore += 1;
      }else {
        // If the card values are equal, declare war
        dispatch({ type: 'DECLAREWAR' });
        return;
      }

      dispatch({ type: 'UPDATESCORE', playerScore, computerScore });
      setCurrentCardIndex(currentCardIndex + 1);

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
    }, 2000);
  };

  const newGame = () => {
    // Refresh the page
    window.location.reload();
  };


  return (
    <div className='gameContainer'>
       
         <div className='btnContainer'>
         <button className='gameBtn' onClick={newGame}>Restart</button>
        <button className='gameBtn' onClick={() => { setGameStarted(true); drawCard(); }}>Draw Card</button>
        <button className='gameBtn' onClick={endGame}>End Game</button>
      </div>
  
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
          {state.war && (
        <div className='warCards'>
          <img className="warCard" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder" />
          <img className="warCard" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder" />
          <img className="warCard" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder" />
          </div>
          )}
          {/* <hr></hr> */}
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




