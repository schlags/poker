import { TexasHoldEmPokerGameType, IDeck, ICard, PokerScoreService, IPlayer, PokerHandType, Card, Suit, CardName } from "typedeck";

// util for easy adding logs
const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
    return [{ dt: new Date().getTime(), message: message }, ...logs].slice(
        0,
        MAX_LOG_SIZE
    );
};

// If there is anything you want to track for a specific user, change this interface
export interface User {
    id: string;
    balance: number;
    player: IPlayer;
}

// Do not change this! Every game has a list of users and log of actions
interface BaseGameState {
    users: User[];
    log: {
        dt: number;
        message: string;
    }[];
}

// Do not change!
export type Action = DefaultAction | GameAction;

// Do not change!
export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

// The maximum log size, change as needed
const MAX_LOG_SIZE = 10;

type WithUser<T> = T & { user: User };

export type DefaultAction = { type: "UserEntered" } | { type: "UserExit" };

interface ActualCard {
    suit: Suit;
    cardName: CardName;
}

// This interface holds all the information about your game
export interface GameState extends BaseGameState {
    deck: IDeck;
    round: number;
    tableCards: ActualCard[];
    pot: number;
    privateUserHand: string;
}

// This is how a fresh new game starts out, it's a function so you can make it dynamic!
// In the case of the guesser game we start out with a random target
export const initialGame = () => ({
    users: [],
    deck: new TexasHoldEmPokerGameType().createDeck(),
    log: addLog("Game Created!", []),
    round: 0,
    tableCards: [],
    pot: 0,
    privateUserHand: "",
});

// Here are all the actions we can dispatch for a user
type GameAction = { type: "deal"; ante: number } | { type: 'call' } | { type: 'raise', amount: number } | { type: 'fold' } | { type: 'all-in' } | { type: 'bet', amount: number } | { type: 'advance' } | { type: 'see-hand' };

export const gameUpdater = (
    action: ServerAction,
    state: GameState
): GameState => {
    // This switch should have a case for every action type you add.

    // "UserEntered" & "UserExit" are defined by default

    // Every action has a user field that represent the user who dispatched the action,
    // you don't need to add this yourself
    switch (action.type) {
        case "UserEntered":
            return {
            ...state,
            users: [...state.users, action.user],
            log: addLog(`user ${action.user.id} joined 🎉`, state.log),
            };

        case "UserExit":
            return {
            ...state,
            users: state.users.filter((user) => user.id !== action.user.id),
            log: addLog(`user ${action.user.id} left 😢`, state.log),
            };

        case "deal":
            if (action.ante <= 0) {
                console.log("Ante must be greater than 0");
                state.log = addLog(`user ${action.user.id} tried to deal with an ante of ${action.ante}, but the ante must be greater than 0!`, state.log)
                return state;
            }
            if (state.deck.getCount() < 52) {
                // This game has already been started, we can't deal again
                console.log("Game has already begun, can't deal again");
                state.log = addLog(`user ${action.user.id} tried to deal again, but the game has already begun!`, state.log)
                return state;
            }
            const players = state.users.map((user) => user.player);
            state.users.forEach((user) => user.balance -= action.ante);
            state.pot = state.users.length * action.ante;
            state.deck.shuffle();
            players.forEach((player) => state.deck.deal(player.getHand(), 2))
            console.log(`Players have been dealt their cards. ${players[0].getHand().getCards().length} cards in hand.`)
            players.forEach((player) => console.log(`Player ${player.name} has ${player.getHand().getCards()} in hand.`))
            console.log(`The deck has ${state.deck.getCount()} cards left.`)
            state.log = addLog(`user ${action.user.id} dealt the cards`, state.log);
            state.round=1;
            return state;
        case "bet":
            if (action.amount <= 0) {
                console.log("Bet must be greater than 0");
                state.log = addLog(`user ${action.user.id} tried to bet ${action.amount}, but the bet must be greater than 0!`, state.log)
                return state;
            }
            if (action.amount > action.user.balance) {
                console.log("Bet must be less than or equal to the user's balance");
                state.log = addLog(`user ${action.user.id} tried to bet ${action.amount}, but the bet must be less than or equal to the user's balance!`, state.log)
                return state;
            }
            action.user.balance -= action.amount;
            console.log(`user ${action.user.id} bet ${action.amount}`)
            state.log = addLog(`user ${action.user.id} bet ${action.amount}`, state.log);
            return state;
        case "advance":
            if (state.deck.getCount() === 52) {
                console.log("Game has not been started, can't advance");
                state.log = addLog(`user ${action.user.id} tried to advance the game, but the game has not been started!`, state.log)
                return state;
            }
            switch (state.round) {
                case 1:
                    console.log(`Advancing to next stage`)
                    state.round++;
                    state.tableCards = state.deck.takeCards(3);
                    state.users.forEach((user) => {
                        user.player.getHand().addCardsToBottom(state.tableCards)
                    });
                    break;
                case 2:
                    console.log(`Advancing to next stage`)
                    state.round++;
                    const fourthCard = state.deck.takeCard();
                    state.tableCards.push(fourthCard);
                    state.users.forEach((user) => {
                        user.player.getHand().addCardsToBottom([fourthCard])
                    });
                    break;
                case 3:
                    console.log(`Advancing to next stage`)
                    state.round++;
                    const fifthCard = state.deck.takeCard();
                    state.tableCards.push(fifthCard);
                    state.users.forEach((user) => {
                        user.player.getHand().addCardsToBottom([fifthCard])
                    });
                    break;
                case 4:
                    console.log(`Checking winning hand!`)
                    const scoreService = new PokerScoreService;
                    // const results = scoreService.scoreHand(state.users[0].player.getHand());
                    const results = state.users.map((user) => {
                        return {
                            user: user,
                            result: scoreService.scoreHand(user.player.getHand())
                        }
                    });
                    // add winnings to the user's balance with the largest score
                    // TODO: if there is a tie, split the pot

                    const winner = results.reduce((prev, curr) => {
                        if (curr.result.value > prev.result.value) {
                            return curr;
                        }
                        return prev;
                    });

                    winner.user.balance += state.pot;
                    state.pot = 0;

                    state.log = addLog(`The winner is ${winner.user.id} with the hand of ${PokerHandType[winner.result.handType!]}`, state.log)


                    console.log(`The results are ${JSON.stringify(results)}`)
                    state.round++;
                    break;
                default:
                    console.log(`Invalid round ${state.round}`)
                    // Reset the deck but keep the users
                    state.deck = new TexasHoldEmPokerGameType().createDeck();
                    state.deck.shuffle();
                    state.round = 0;
                    state.tableCards = [];
                    state.pot = 0;
                    state.users.forEach((user) => {
                        user.player.getHand().takeCards(user.player.getHand().getCards().length);
                    });
                    break;
            }
            return state;
        case "see-hand":
            console.log(`user ${action.user.id} checking their hand`)
            state.log = addLog(`THIS IS PRIVATE! user ${action.user.id} has ${action.user.player.getHand().getCards()} in hand`, state.log);
            return state;
        default:
            return state;
    }
};
