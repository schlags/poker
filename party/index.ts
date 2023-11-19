import type * as Party from "partykit/server";

import { gameUpdater, initialGame, Action, ServerAction } from "../game/logic";
import { GameState } from "../game/logic";
import { Player, IDeck } from "typedeck";

interface ServerMessage {
    state: GameState;
}

export default class PokerServer implements Party.Server {
    private gameState: GameState;

    constructor(readonly party: Party.Party) {
        this.gameState = initialGame();
        console.log(`Poker table created: ${party.id}`);
    }

    broadcastState = () => {
        this.party.broadcast(JSON.stringify(this.gameState));
    }

    onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
        console.log(`User ${connection.id} connected`);
        this.gameState = gameUpdater(
            { type: "UserEntered", user: {id: connection.id, balance: 500, player: new Player(connection.id)} },
            this.gameState
        );
        this.broadcastState();
    }
    onClose(connection: Party.Connection) {
        console.log(`User ${connection.id} disconnected`);
        this.gameState = gameUpdater(
            { type: "UserExit", user: {id: connection.id, balance: 500, player: new Player(connection.id)} },
            this.gameState
        );
        this.broadcastState();
    }
    onMessage(message: string, sender: Party.Connection) {
        const user = this.gameState.users.find((u) => u.id === sender.id);
        if (!user) {
            console.error(`User ${sender.id} not found`);
            return;
        }
        const action: ServerAction = {
          ...(JSON.parse(message) as Action),
          user: user,
        };
        console.log(`Received action ${action.type} from user ${sender.id}`);
        this.gameState = gameUpdater(action, this.gameState);
        if (action.type === "see-hand") {
            console.log(`User ${sender.id} checking their hand`);
            const allOtherUserIds = this.gameState.users.filter((u) => u.id != sender.id).map((u) => u.id);
            console.log(`Excluding from broadcast: ${allOtherUserIds}`)
            this.party.broadcast(JSON.stringify(this.gameState), allOtherUserIds);
        }
        this.broadcastState();
    }
}