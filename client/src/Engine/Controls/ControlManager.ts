
//LocalImports
import * as QUEUE from '../../common-utilities/AbstractDataTypes/Queue'
import * as COMMAND from '../../common-game/control/Command';

export class ControlManager {

    /*

    setPiece is the only command that requires a reply.

     cmd.cmdType        cmd.cmdValue
    'setPiece'    |     Vector3: denotes position the piece is in.
    'rotation'    |     Vector3: the rotation applied to the euler vec
    'movement'    |     Vector3: denotes the direction to add to the current position
    'newPlayer'   |     Client: 

    */
    public clientId:string|null;
    
    private commandsProcessing: COMMAND.Command<any>[];
    private commandQueue: QUEUE.Queue<COMMAND.Command<any>>;

    constructor(){
        this.clientId= null;
        this.commandQueue = new QUEUE.Queue<COMMAND.Command<any>>();
        this.commandsProcessing = [];
    }

    public addToProcessing(cmd:COMMAND.Command<any>){
        this.commandsProcessing.push(cmd);
    }

    public removeProcessing(cmdType:string){

    }

    public queCommand(cmd:COMMAND.Command<any>){
        cmd.id = this.clientId;
        this.commandQueue.enqueue(cmd);
    }

    /**
     * Processes commands if there are any. This function should be called once per frame.
     */
    public getCommand():COMMAND.Command<any>|undefined{
        if( !this.commandQueue.isEmpty() ){
            let command = this.commandQueue.dequeue();
            return command;
        }
        else{
            return undefined;
        }
    }

}