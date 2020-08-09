
//LocalImports
import * as QUEUE from '../../common-utilities/AbstractDataTypes/Queue'
import * as COMMAND from '../../common-game/control/Command';

export class ControlManager {

    public clientId:string|null;
    private commandQueue: QUEUE.Queue<COMMAND.Command<any>>;

    constructor(){
        this.clientId= null;
        this.commandQueue = new QUEUE.Queue<COMMAND.Command<any>>();
    }

    public removeProcessing(cmdType:string){

    }

    public queCommand(cmd:COMMAND.Command<any>){
        this.commandQueue.enqueue(cmd);
    }

    /**
     * Processes commands if there are any. This function should be called once per frame.
     */
    public getCommand():COMMAND.Command<any>|undefined{
        if( !this.commandQueue.isEmpty() ){
            let command = this.commandQueue.dequeue();
            if(this.clientId!==null){
                command.id = this.clientId;
            }
            return command;
        }
        else{
            return undefined;
        }
    }

}