import React from 'react';
import PlayingCardComp from './PlayingCard';

interface FannedPlayingCardsProps {
  cards: { suit: string; cardName: string }[];
}

const FannedPlayingCards: React.FC<FannedPlayingCardsProps> = ({ cards }) => {
  const angleIncrement = 15; // Adjust the angle between cards

  return (
    <div className="flex items-center justify-center">
      {cards.map((card, index) => (
        <div
        key={index}
        className="relative"
        style={{
          transform: `rotate(${index * angleIncrement - (cards.length - 1) * angleIncrement / 2}deg)`, // Rotate each card
        }}
      >
        <PlayingCardComp suit={card.suit} cardName={card.cardName} />
      </div>
      ))}
    </div>
  );
};

export default FannedPlayingCards;
