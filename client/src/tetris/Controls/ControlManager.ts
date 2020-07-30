import * as QUEUE from '../utilities/DataTypes/Queue';
import * as NETWORK from '../Network';
import * as SOCKET from 'socket.io';


export class ControlManager extends QUEUE.Queue<string>{

    public isProcessingCommand: boolean; //Controls whether we can process another command or not.
    
    private socket: SOCKET.Socket;                 //The clients socket object reference for processing commands.
    private game:any;

    constructor(game:any){
        super();

        console.log(game);
        this.game = game;
        this.isProcessingCommand = false;
    }

    public addCommand(cmd:string){
        this.enqueue(cmd);
    }

    /**
     * Processes commands if there are any. This function should be called once per frame.
     */
    public processCommand(){
        //TODO decouple this section from the ControlManager
       // console.log(this);
        if(this.socket!==null && this.isProcessingCommand===false && this.isEmpty()!==false && this.game.currentPiece!==null){

            this.game.currentPiece.update(); 
            if(!this.game.currentPiece.collision_isBlocked[this.front()]){
                NETWORK.sendCommand( this.dequeue(), this.game);
                this.isProcessingCommand=true;
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