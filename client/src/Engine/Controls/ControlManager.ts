
//LocalImports
import * as GAME from '../Game/Game'
import * as QUEUE from '../Util/AbstractDataTypes/Queue'
import * as NETWORK from '../Network/ClientNetwork'
import * as T from '../Util/types';
import * as COMMAND from './Command';

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

        //console.log(this);
        //console.log(this.game.currentPiece);
        if( this.isEmpty()===false && this.isProcessingCommand===false ){
 
            let command = this.dequeue();
        
            if(this.game.validateCommand(command)){
                this.network.sendCommand(command);
                this.isProcessingCommand=true;  
            }
            else{
                if(command.cmdValue.y===-1 && this.game.currentPiece.collision_isBlocked.down){
                    let cmd = new COMMAND.Command(this.game.clientId,'setPiece',this.game.getBlockPositions());
                    this.game.currentPiece = null;
                    this.isProcessingCommand=true; 
                    this.network.sendCommand(cmd);
                }
            }
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