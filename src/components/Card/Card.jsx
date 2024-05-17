import React, { useEffect, useState } from 'react';
import { API_DECK_OF_CARDS } from '../../data/api';
import './Card.css';
import Game from '../Game/Game';

const fetchCardData = async () => {
  try {
    const response = await fetch(API_DECK_OF_CARDS);
    if (!response.ok) {
      throw new Error('Failed to fetch card data');
    }
    const data = await response.json();
    console.log(data.cards); // Log the cards data
    return data.cards;
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw error;
  }
};

export default function Card() {
  const [playerCards, setPlayerCards] = useState([]);
  const [computerCards, setComputerCards] = useState([]);

  const distributeCards = async () => {
    try {
      const cards = await fetchCardData();
      const playerCards = cards.slice(0, 26);
      const computerCards = cards.slice(26);
      setPlayerCards(playerCards);
      setComputerCards(computerCards);
    } catch (error) {
      console.error('Error distributing card data:', error);
    }
  };

  useEffect(() => {
    distributeCards();
  }, []);

  return (
    <div className='cardContainer'>
      <Game playerCards={playerCards} computerCards={computerCards} />
      {/* <div>
        <h2>Player Cards</h2>
        <ul>
          {playerCards.map((card, index) => (
            <li key={index}>{card.value} of {card.suit}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Computer Cards</h2>
        <ul>
          {computerCards.map((card, index) => (
            <li key={index}>{card.value} of {card.suit}</li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

