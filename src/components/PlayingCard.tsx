import React from 'react';

interface PlayingCardProps {
  suit: string;
  cardName: string;
}

const PlayingCardComp: React.FC<PlayingCardProps> = ({ suit, cardName }) => {
  // All of the card images can be accessed like https://upload.wikimedia.org/wikipedia/commons/c/c2/Cards-10-Diamond.svg
  const cardImage = `/${cardName}_of_${suit}.svg`;

  return (
    <div className="border-2 border-black p-2 rounded-lg shadow-lg inline-block m-2">
      <img
        src={cardImage}
        alt={`${cardName} of ${suit}`}
        className="w-32 h-48" // Adjust the size as needed
      />
    </div>
  );
};

export default PlayingCardComp;
