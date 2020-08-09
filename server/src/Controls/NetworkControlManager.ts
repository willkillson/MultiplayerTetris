
//NodeImports
import * as THREE from 'three';
import * as SOCKET from 'socket.io';

//CommonImports
import * as COMMAND from '../common-game/control/Command';
import * as QUEUE from '../common-utilities/AbstractDataTypes/Queue';
import * as BLOCK from '../common-game/entities/Block/Block';
import * as T from '../common-utilities/types';
import * as GAME from '../common-game/Game';

//LocalImports
import * as SERVER from '../Server'

/**
 * Each player will have a queue of commands. A call to poll commands will retrieve one
 * command per player if they have any commands queued up. This is to ensure that a player
 * can only issue one command per server "frame", or unit of time.
 */
export class NetworkControlManager {

    //Each player will have their own queue that contains commands
    public players: Map<string,QUEUE.Queue<COMMAND.Command<THREE.Vector3>>>;
    public server:SERVER.default;

    constructor(server:SERVER.default){
        this.server = server;
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
        this.players.get(cmd.id).enqueue(cmd);
    }

    /**
     */
    public pollAndProcessCommands(game:GAME.Game ){  
        let playerNames = Array.from(this.players.keys());
        playerNames.forEach(player=>{
            let cmd = this.players.get(player).dequeue();
            if(cmd!==undefined){
                switch(cmd.cmdType){
                    case "movement":
                        this.movement(game, cmd);
                        break;
                    case "rotation":
                        this.rotation(game,cmd);
                        break;
                    case "setPiece":
                        this.setPiece(game,cmd);   
                        break;
                    case "newPlayer":
                        this.newPlayer(game,cmd);
                        break;
                    case "playerRemove":
                        this.playerRemove(game,cmd);
                        break;
                }
            }
        });  
    }

    private movement(game:GAME.Game, cmd:COMMAND.Command<THREE.Vector3>):void{

        console.log("private movement(game:GAME.Game, cmd:COMMAND.Command<THREE.Vector3>):void");
        console.log({cmd});

        game.processCommand(cmd);
        this.server.userSockets.get(cmd.id).broadcast.emit('onCommand', cmd);
    }

    private rotation(game:GAME.Game, cmd:COMMAND.Command<any>): void {

        console.log("private rotation(game:GAME.Game, cmd:COMMAND.Command<any>): void");
        console.log({cmd});

        game.processCommand(cmd);
        this.server.userSockets.get(cmd.id).broadcast.emit('onCommand', cmd);
    }

    private setPiece(game:GAME.Game, cmd:COMMAND.Command<any>): void {

        console.log("private setPiece(game:GAME.Game, cmd:COMMAND.Command<any>): void");
        console.log({cmd});

        //'setPiece'    |     Client: denotes position the piece is in.
        game.processCommand(cmd);
   
        let clientInfo = generateClientInfo(cmd.id);// Create the new piece data for the player that sent this.
        game.newPiece(clientInfo);// Generate it.

        let ongoingCommand = new COMMAND.Command("SERVER","newPiece",clientInfo);
        this.server.userSockets.get(cmd.id).broadcast.emit('onCommand', cmd); // Let all the other players know to set this piece.
        this.server.io.emit('onCommand', ongoingCommand); // Let all the players know this is the new peiece for this player.
    
    }

    private newPlayer(game:GAME.Game, cmd:COMMAND.Command<any>): void {

        console.log("private newPlayer(game:GAME.Game, cmd:COMMAND.Command<any>): void");
        console.log({cmd});

        game.processCommand(cmd);
        
        const newConnectionInfo = <T.NewConnectionInfo>{};
        newConnectionInfo.users = game.getPlayersInfo();
        newConnectionInfo.persistentBlocks = game.getPersistentBlocks();
        newConnectionInfo.serverTime = this.server.serverTime;
        newConnectionInfo.clientId = cmd.id;

        this.server.userSockets.get(cmd.id).emit('onConnected',newConnectionInfo);  
        this.server.userSockets.get(cmd.id).broadcast.emit('onCommand', cmd);
        
    }

    private playerRemove(game:GAME.Game, cmd:COMMAND.Command<any>): void {

        console.log("private playerRemove(game:GAME.Game, cmd:COMMAND.Command<any>): void");
        console.log({cmd});

        game.processCommand(cmd);
        this.removePlayer( cmd.id );
        this.server.userSockets.get(cmd.id).broadcast.emit('onCommand', cmd);
        this.server.userSockets.delete( cmd.id);
    }

    private newPiece(game:GAME.Game, cmd:COMMAND.Command<any>): void {
        
        //TODO:
    }
}

const generateClientInfo = ( clientId:string ):T.Client =>{
    let info = <T.Client>{};
    info.id = clientId;
    info.pieceType = Math.floor(Math.random()*7); 
    info.rotation = new THREE.Vector3(0,0,0);
    info.position = new THREE.Vector3(Math.floor(Math.random()*13)-5,18,0);
    return info;
}