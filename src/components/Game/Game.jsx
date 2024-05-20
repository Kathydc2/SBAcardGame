import React, { useContext, useState, useEffect, useReducer } from 'react';
import { GameContext } from '../../App';
import './Game.css';

const initialState = {
  playerScore: 0,
  computerScore: 0,
  gameStarted: false,
  cardsRemaining: 52,
  currentCardIndex: 0,
  playerCards: [], 
  computerCards: [],
  war: false,
  warMessage: null,
  gameEnded: false,
  playerFourthCard: null,
  computerFourthCard: null,
};

const getValue = (value) => {
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
      return parseInt(value, 10);
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true,
      };
    case 'UPDATESCORE':
      return {
        ...state,
        playerScore: action.playerScore,
        computerScore: action.computerScore,
        currentCardIndex: state.currentCardIndex + 1,
        cardsRemaining: state.cardsRemaining - 1,
      };
    case 'DECLAREWAR':
      return {
        ...state,
        war: true,
      };
    case 'RESETCARDS':
      return {
        ...initialState,
        playerCards: action.playerCards,
        computerCards: action.computerCards,
      };
    case 'RESOLVEWAR':
      console.log("Resolving war...");
      console.log("Current index:", state.currentCardIndex);
      console.log("Player cards length:", state.playerCards.length);
      console.log("Computer cards length:", state.computerCards.length);

      const currentCardIndex = state.currentCardIndex;
      const playerCards = state.playerCards.slice(state.currentCardIndex, state.currentCardIndex + 4);
      const computerCards = state.computerCards.slice(state.currentCardIndex, state.currentCardIndex + 4);

      if (playerCards.length < 4 || computerCards.length < 4) {
        return {
          ...state,
          warMessage: "Not enough cards for war",
          war: false,
        };
      }

      const playerFourthCardValue = getValue(playerCards[3].value);
      const computerFourthCardValue = getValue(computerCards[3].value);

      let newPlayerScore = state.playerScore;
      let newComputerScore = state.computerScore;
      let warMessage = '';

      if (playerFourthCardValue > computerFourthCardValue) {
        newPlayerScore += 8;
        warMessage = `${action.playerName} Wins!`;
      } else if (playerFourthCardValue < computerFourthCardValue) {
        newComputerScore += 8;
        warMessage = `Computer Wins!`;
      } else {
        warMessage = `War is a draw!`;
      }

      const updatedState = {
        ...state,
        playerScore: newPlayerScore,
        computerScore: newComputerScore,
        currentCardIndex: currentCardIndex + 4,
        cardsRemaining: state.cardsRemaining - 4,
        war: false,
        warMessage: warMessage,
        playerFourthCard: playerCards[3],
        computerFourthCard: computerCards[3],
      };
      
      if (updatedState.currentCardIndex >= state.playerCards.length || updatedState.currentCardIndex >= state.computerCards.length) {
        updatedState.gameEnded = true;
      }

      return updatedState;
    case 'CLEARWARMESSAGE':
      return {
        ...state,
        warMessage: null,
        war: false,
      };
    default:
      return state;
  }
};

export default function Game({ playerCards = [], computerCards = []}) {
  const playername = useContext(GameContext);
  const { playerName } = playername;
  const [gameStarted, setGameStarted] = useState(false);
  const [cardsRemaining, setCardsRemaining] = useState(52);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [state, dispatch] = useReducer(reducer, { ...initialState, playerCards, computerCards });
  const [gameResult, setGameResult] = useState("");

  useEffect(() => {
    if (state.war) {
      setTimeout(() => {
        dispatch({ type: 'RESOLVEWAR', playerName });
      }, 2000);
    }
  }, [state.war]);

  useEffect(() => {
    let timeoutId;
    if (state.warMessage) {
      timeoutId = setTimeout(() => {
        dispatch({ type: 'CLEARWARMESSAGE' });
      }, 2000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [state.warMessage]);


  const drawCard = () => {
    if (!state.gameStarted) {
      dispatch({ type: 'START_GAME' });
      return;
    }
    if (state.cardsRemaining > 0 && !state.war) {
      const playerCard = state.playerCards[state.currentCardIndex];
      const computerCard = state.computerCards[state.currentCardIndex];

      if (!playerCard || !computerCard) {
        return;
      }

      const playerCardValue = getValue(playerCard.value);
      const computerCardValue = getValue(computerCard.value);

      let playerScore = state.playerScore;
      let computerScore = state.computerScore;

      if (playerCardValue === computerCardValue) {
        dispatch({ type: 'DECLAREWAR' });
        return;
      }

      if (playerCardValue > computerCardValue) {
        playerScore += 1;
      } else {
        computerScore += 1;
      }

      dispatch({ type: 'UPDATESCORE', playerScore, computerScore });

      if (state.currentCardIndex + 1 >= state.playerCards.length || state.currentCardIndex + 1 >= state.computerCards.length) {
        endGame();
      }
    }
  };

  const endGame = () => {
    setGameStarted(false);
    setCardsRemaining(52);
    setCurrentCardIndex(0);
    let endResult = "";
    if (state.playerScore > state.computerScore) {
      endResult = `${playerName} Wins!`;
    } else if (state.computerScore > state.playerScore) {
      endResult = "Computer Wins!";
    } else {
      endResult = "It's a Tie!";
    }
    setGameResult(endResult);
    console.log("Game Result:", endResult); 
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  
  const newGame = () => {
    window.location.reload();
  };

  return (
    <div className='gameContainer'>
      <div className='btnContainer'>
        <button className='gameBtn' onClick={newGame}>Restart</button>
        <button className='gameBtn' onClick={drawCard}>Draw Card</button>
        <button className='gameBtn' onClick={endGame}>End Game</button>
      </div>
      <div className='scoreBoard'>
        <h1>Score</h1>
        <p>{playerName}: {state.playerScore}</p>
        <p>Computer: {state.computerScore}</p>
      </div>
      <div className='gameBoard'>
        <img className="placeHolder" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder"/>
        {state.gameStarted && (
          <>
            <div>
              <h2>{playerName}'s Card</h2>
              {state.playerCards.length > 0 && state.currentCardIndex < state.playerCards.length && (
                <img src={state.playerCards[state.currentCardIndex].image} alt={`Player's Card`} />
              )}
            </div>
            {state.war && (
              <div className='animation'>
                <img className="warAnimate" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder" />
                <img className="warAnimate" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder" />
                <img className="warAnimate" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder" />
              </div>
            )}
            {state.warMessage && (
              <div className='warContainer'>
                <p className='warMessage'>{state.warMessage}</p>
                <div>
                  <h2>{playerName}'s Card</h2>
                  {state.playerFourthCard && (
                    <img className="warCard" src={state.playerFourthCard.image} alt={`Player's 4th War Card`} />
                  )}
                </div>
                <div>
                  <h2>Computer's Card</h2>
                  {state.computerFourthCard && (
                    <img className="warCard" src={state.computerFourthCard.image} alt={`Computer's 4th War Card`} />
                  )}
                </div>
              </div>
            )}
            <div>
              <h2>Computer's Card</h2>
              {state.computerCards.length > 0 && state.currentCardIndex < state.computerCards.length && (
                <img src={state.computerCards[state.currentCardIndex].image} alt={`Computer's Card`} />
              )}
            </div>
          </>
        )}
        {!state.gameStarted && state.gameResult && (
          <div>
            <h2>{state.gameResult}</h2>
            {console.log("Game Result:", gameResult)}
          </div>
        )}
        <img className="placeHolder" src="https://opengameart.org/sites/default/files/card%20back%20red.png" alt="placeholder"/>
      </div>
    </div>
  );
}





