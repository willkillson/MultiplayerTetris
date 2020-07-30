import * as SOCKET from 'socket.io';
import * as QUEUE from '../utilities/DataTypes/Queue'
import * as COMMAND from '../Controls/Command'
import { Color } from 'three';
import { receiveMessageOnPort } from 'worker_threads';

/**
 * Each player will have a queue of commands. A call to poll commands will retrieve one
 * command per player if they have any commands queued up. This is to ensure that a player
 * can only issue one command per server "frame", or unit of time.
 */
export class NetworkControlManager {

    //Each player will have their own queue that contains commands
    private players: Map<string,QUEUE.Queue<COMMAND.Command<any>>>;

    constructor(){
        this.players = new Map();
    }

    public addPlayer(uuid:string){
        this.players.set(uuid,new QUEUE.Queue());
    }

    public removePlayer(uuid:string){
        this.players.delete(uuid);
    }

    public contains(uuid:string):boolean{
        return this.players.has(uuid);
    }

    public addCommand( cmd: COMMAND.Command<any> ){
        
        this.players.get(cmd.owner).enqueue(cmd.cmdValue);
    }

    /**
     * Returns an array of commands recently dequeued from all
     * player command que's.
     */
    public pollCommands():COMMAND.Command<any>[]{
        let retCmds: COMMAND.Command<any>[] = [];
    
        Array.from(this.players.keys()).forEach((key)=>{
            if(!this.players.get(key).isEmpty()){
                retCmds.push(this.players.get(key).dequeue());
            }
        })

        return retCmds;        
    }

}