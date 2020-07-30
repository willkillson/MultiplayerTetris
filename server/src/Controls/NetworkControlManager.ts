import * as SOCKET from 'socket.io';
import * as QUEUE from '../utilities/DataTypes/Queue'
import * as COMMAND from '../Controls/Command'
import * as CLIENT from '../Entities/Client';
import * as THREE from 'three';
import { Color } from 'three';
import { receiveMessageOnPort } from 'worker_threads';

/**
 * Each player will have a queue of commands. A call to poll commands will retrieve one
 * command per player if they have any commands queued up. This is to ensure that a player
 * can only issue one command per server "frame", or unit of time.
 */
export class NetworkControlManager {

    //Each player will have their own queue that contains commands
    private players: Map<string,QUEUE.Queue<COMMAND.Command<THREE.Vector3>>>;

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

    public addCommand( cmd: COMMAND.Command<THREE.Vector3> ){
        
        this.players.get(cmd.owner).enqueue(cmd);
    }

    /**
     */
    public pollAndProcessCommands( users: CLIENT.Client[] ){  
        Array.from(this.players.keys())
        .forEach(player=>{
            let cmd = this.players.get(player).dequeue();
            if(cmd!==undefined){
                //find the player
                let index = users.findIndex(usr=>{ return usr.id===player});
                switch(cmd.cmdType){
                    case 'up':
                      users[index].position.add(cmd.cmdValue);
                      break;
                    case 'down':
                      users[index].position.add(cmd.cmdValue);
                      break;
                    case 'left':
                        users[index].position.add(cmd.cmdValue);
                      break;
                    case 'right':
                        users[index].position.add(cmd.cmdValue);
                      break;
                    case 'in':
                        users[index].position.add(cmd.cmdValue);
                      break;
                    case 'out':
                        users[index].position.add(cmd.cmdValue);
                      break;
                    case 'ccw':
                        users[index].rotation.add(cmd.cmdValue);
                      break;
                    case 'cw':
                        users[index].rotation.add(cmd.cmdValue);
                      break;
                  }
                  console.log("After");
                  console.log(users[index].position);
            }
  
        });  
    }


}