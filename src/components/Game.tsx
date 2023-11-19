import { useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { stringToColor } from "@/utils";
import FannedPlayingCards from "./FannedPlayingCards";
import "react-typescript-playing-card/dist/index.css";
import PokerButton from "./PokerButton";
import { CardName, Suit } from "typedeck";
import PlayingCardComp from "./PlayingCard";

interface GameProps {
  username: string;
  roomId: string;
}

const cardNameMapping: Record<CardName, string> = {
  [CardName.Ace]: 'ace',
  [CardName.Two]: '2',
  [CardName.Three]: '3',
  [CardName.Four]: '4',
  [CardName.Five]: '5',
  [CardName.Six]: '6',
  [CardName.Seven]: '7',
  [CardName.Eight]: '8',
  [CardName.Nine]: '9',
  [CardName.Ten]: '10',
  [CardName.Jack]: 'jack',
  [CardName.Queen]: 'queen',
  [CardName.King]: 'king',
  [CardName.Joker]: 'joker',
};

const suitNameMapping: Record<Suit, string> = {
  [Suit.Clubs]: 'clubs',
  [Suit.Diamonds]: 'diamonds',
  [Suit.Hearts]: 'hearts',
  [Suit.Spades]: 'spades',
}

const Game = ({ username, roomId }: GameProps) => {
  const { gameState, dispatch } = useGameRoom(username, roomId);

  // Local state to use for the UI
  const [ante, setAnte] = useState<number>(0);
  // Indicated that the game is loading
  if (gameState === null) {
    return (
      <div className="text-center">
        <h1 className="text-3xl text-center relative animate-bounce">
          🃏
        </h1>
        Waiting for server...
      </div>
    );
  } else if (gameState.users.length === 0 || gameState.users.length === 1) {
    return (
      <div className="text-center">
        <h1 className="text-3xl text-center relative animate-bounce">
          🃏
        </h1>
        Waiting for players...
      </div>
    );
  }

  const handleGuess = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // Dispatch allows you to send an action!
    // Modify /game/logic.ts to change what actions you can send
    dispatch({ type: "deal", ante: ante });
  };

  const handleAdvance = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch({ type: "advance" });
  };


  const handleSeeHand = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch({ type: "see-hand" });
  };

  const displayTableCards = () => {
    const tableCards = gameState.tableCards;
    console.log(tableCards);
    const cards = tableCards.map((card) => {
      return {
        suit: suitNameMapping[card.suit],
        cardName: cardNameMapping[card.cardName],
      }
      });
    return (
      <div className="flex items-center justify-center">
        <FannedPlayingCards cards={cards} />
      </div>
    );
  };

  return (
    <>
      <h1 className="text-2xl text-center relative">
        {`Welcome to Poker Table: ${roomId}`}
      </h1>
      <section>
        <h2 className="text-lg">Pot</h2>
        <div className="flex flex-wrap gap-2">
          {
            gameState.pot
          }
          {
            displayTableCards()
          }

        </div>
        <form
          className="flex gap-4 py-6 grid cols-2 items-center"
          onSubmit={handleGuess}
        >
          <input
            type="range"
            name="guess"
            id="guess"
            className="opacity-70 hover:opacity-100 accent-purple-400"
            onChange={(e) => setAnte(Number(e.currentTarget.value))}
            value={ante}
          />
          <PokerButton buttonText={`Deal Ante ${ante}`} color={"blue"} disabled={gameState.round != 0}/>
        </form>

        <div className=" bg-yellow-100 flex flex-col p-4 rounded text-sm">
          {gameState.log.map((logEntry, i) => (
            <p key={logEntry.dt} className="animate-appear text-black">
              {logEntry.message}
            </p>
          ))}
        </div>
        <br />
        <div className="flex flex-wrap gap-2 justify-center">
        <PokerButton buttonText="Advance" color={"blue"} handleFunc={handleAdvance} disabled={gameState.round === 0} />
        <PokerButton buttonText="See Hand" color={"blue"} handleFunc={handleSeeHand} disabled={gameState.round === 0}/>
        </div>

        <h2 className="text-lg">
          Players in room <span className="font-bold">{roomId}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {gameState.users.map((user) => {
            console.log(user);
            return (
              <p
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white"
                style={{ backgroundColor: stringToColor(user.id + roomId) }}
                key={user.id}
              >
                {user.id === username ? `You: ${user.id}` : user.id}
                { ` - Balance: ${user.balance}` }
              </p>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Game;
