
//LocalImports
import * as GAME from '../../common-game/Game'
import * as QUEUE from '../../common-utilities/AbstractDataTypes/Queue'
import * as NETWORK from '../Network/ClientNetwork'
import * as T from '../../common-utilities/types';
import * as COMMAND from '../../common-game/control/Command';

export class ControlManager extends QUEUE.Queue<COMMAND.Command<any>>{

    private isProcessingCommand: boolean;   //Controls whether we can process another command or not.             
    private network:NETWORK.ClientNetwork;
    private game:GAME.Game;

    constructor( game:GAME.Game, network:NETWORK.ClientNetwork ){
        super();
        this.isProcessingCommand = false;
        this.network = network;
        this.game = game;
    }

    public addCommand(cmd:COMMAND.Command<any>){
        this.enqueue(cmd);
    }

    /**
     * Processes commands if there are any. This function should be called once per frame.
     */
    public processCommand(){
        //TODO: Refactor this method to take in the piece of the player.

        //console.log(this);
        //console.log(this.game.currentPiece);
        if(this.game.gameState.resetGame){
            let cmd = new COMMAND.Command(this.game.clientId,'reset', 'reset');
            this.game.gameState.resetGame = false;
            this.game.gameState.waitingForUpdate = true;
            this.network.sendCommand(cmd);
        }
        if( !this.isEmpty() ){
            let command = this.dequeue();
            // if(this.game.currentPiece.update(command)){
            //     this.network.sendCommand(command);
            // }
            // else if(command.cmdValue.y===-1 && this.game.currentPiece.collision_isBlocked.down && this.game.currentPiece!==null)
            // {
            //     let cmd = new COMMAND.Command(this.game.clientId,'setPiece',this.game.getBlockPositions());
            //     this.game.gameState.waitingForUpdate = true;
            //     this.game.currentPiece.removePiece();
            //     this.game.currentPiece = null; 
            //     this.game.gameState.waitingForNewPiece = true;
            //     this.network.sendCommand(cmd);
            // }
        }
        
    }
    
    /**
     * This function is called by the sever to notify the 
     * control manager that a command has been processed.
     */
    public freeUpControls(){
        this.isProcessingCommand = false;
    }
}