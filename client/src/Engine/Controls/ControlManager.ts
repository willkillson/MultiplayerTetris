
//LocalImports
import * as QUEUE from '../../common-utilities/AbstractDataTypes/Queue'
import * as COMMAND from '../../common-game/control/Command';
import * as T from '../../common-utilities/types';
import {Engine} from '../Engine';

export class ControlManager {

    public clientId:string;
    private engine:Engine;
    private commandQueue: QUEUE.Queue<COMMAND.Command<any>>;

    constructor(engine:Engine){
        this.clientId = '';
        this.engine = engine;
        this.commandQueue = new QUEUE.Queue<COMMAND.Command<any>>();
    }

    public queCommand(cmd:COMMAND.Command<any>){
        this.commandQueue.enqueue(cmd);
    }

    public getCurrentPlayerClientInfo(): T.Client{
        let info = this.engine.game.getPlayersInfo().find((e)=>{return e.id===this.clientId});
        if(info===undefined){
            throw Error("public getCurrentPlayerClientInfo(): T.Client has returned undefined.");
        }    
        return info;
    }

    /**
     * Processes commands if there are any. This function should be called once per frame.
     */
    public getCommand():COMMAND.Command<any>|undefined{
        if( !this.commandQueue.isEmpty() ){
            let command = this.commandQueue.dequeue();
            if(this.clientId!==''){
                command.id = this.clientId;
            }
            return command;
        }
        else{
            return undefined;
        }
    }

}