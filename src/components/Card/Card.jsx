import React, { useEffect, useState} from 'react';
import { API_DECK_OF_CARDS } from '../../data/api';
import Game from '../Game/Game';

const fetchCardData = async () => {
  try {
    // Fetch full deck of cards
    const responseDeck = await fetch(API_DECK_OF_CARDS);
    if (!responseDeck.ok) {
      throw new Error('Failed to fetchCardData');
    }
    const deckData = await responseDeck.json();
    const deckId = deckData.deck_id;

    // Fetch individual cards using the deck ID
    const responseCards = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=52`);
    if (!responseCards.ok) {
      throw new Error('Failed to fetchDeckId');
    }
    const cardsData = await responseCards.json();
    return cardsData.cards;
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw error;
  }
};

export default function Card() {
  const [playerCards, setPlayerCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);
  const [loading, setLoading] = useState(true); 

  const distributeCards = async () => {
    try {
      const cards = await fetchCardData();
      const playerCards = cards.slice(0, 26);
      const computerCards = cards.slice(26);
      // console.log('Distributed Player Cards:', playerCards); // Log player cards
      // console.log('Distributed Computer Cards:', computerCards);
      setPlayerCards(playerCards);
      setComputerCards(computerCards);
      setLoading(false); // Set loading to false when cards are distributed
    } catch (error) {
      console.error('Error distributing card data:', error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    distributeCards();
  }, []);
  useEffect(() => {
    // console.log('playerCards in Card:', playerCards);
    // console.log('computerCards in Card:', computerCards);
  }, [playerCards, computerCards]);

  return (
    <div className='cardContainer'>
      {loading ? (
        <p>Loading...</p> 
      ) : (
        <Game playerCards={playerCards} computerCards={computerCards} setPlayerCards={setPlayerCards} />
      )}
    </div>
  );
}


