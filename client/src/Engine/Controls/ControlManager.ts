
//LocalImports
import * as GAME from '../Game/Game'
import * as QUEUE from '../Util/AbstractDataTypes/Queue'
import * as NETWORK from '../Network/ClientNetwork'
import * as SOCKET from 'socket.io';


export class ControlManager extends QUEUE.Queue<string>{

    public isProcessingCommand: boolean; //Controls whether we can process another command or not.
    
    private socket: SOCKET.Socket;                 //The clients socket object reference for processing commands.
    private game:GAME.Game;

    constructor(game:GAME.Game){
        super();

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
        if(this.socket!==null && this.isEmpty()===false ){
            let cmd = this.dequeue();      
            if(!this.game.currentPiece.collision_isBlocked[cmd]){
                console.log(this.game.currentPiece.mesh.position);
                //NETWORK.sendCommand(cmd, this.game);
                this.isProcessingCommand=true;  
            }
            else{
                console.log("blocked!");
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