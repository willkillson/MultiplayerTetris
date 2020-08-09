
//NodeImports
import * as io from 'socket.io';
import { v4 as uuidv4 } from 'node-uuid';
import * as THREE from 'three';

//CommonImports
import * as GAME from './common-game/Game';
import * as T from './common-utilities/types';
import MyTime from './common-utilities/time';
import * as COMMAND from './common-game/control/Command'; 

//LocalImports
import { NetworkControlManager } from "./Controls/NetworkControlManager";

const normalizePort = (val:string) => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

export default class Server  {

    public userSockets:Map<string, SocketIO.Socket>; 
    public game:GAME.Game;
    private ncm: NetworkControlManager;

    private port:string|number|false;
    public io: any;

    //serverTime
    public serverTime:number;

    constructor(){
        //Parameters for a new game state.
        let persistentBlocks:Array<T.Block> = [];
        let users:Array<T.Client> = [];
        let info = <T.NewConnectionInfo>{};
        info.clientId = "SERVER";
        info.persistentBlocks = persistentBlocks;
        info.users = users;
        info.serverTime = 0;
        this.game = new GAME.Game();
        this.game.setInitialGameState(info);
        // //init the control manager
        this.ncm = new NetworkControlManager(this);
        //start the server
        this.initServer("80");
        //makes the server constantly broadcast messages to the clients
        this.sendConstantUpdates();
    }

    private initServer(port:string){
        this.userSockets = new Map();
        this.port = normalizePort(process.env.PORT || port);
        this.io = require('socket.io')(this.port);
        console.log(this.port);
        console.log("Listening on port: "+ this.port);
        this.io.on('connection', (socket:SocketIO.Socket)=>{
          this.connection(socket)
          socket.on('disconnect', ()=>this.disconnect(socket));
          socket.on('playerCommand', (info)=>this.playerCommand( socket, info ));
        }); 
    }

    private connection( socket:SocketIO.Socket ){
        // Generates random position variables for the piece.
        let clientInfo = generateClientInfo(socket.id);
        // Store this socket.
        this.userSockets.set(socket.id,socket);                  
        console.log(MyTime() + ' Client '+ socket.id + ' connected.'); 
        //Add the player to the ControlManager
        this.ncm.addPlayer(clientInfo.id);
        let cmd =  <COMMAND.Command<T.Client>>{};
        cmd.id = socket.id;
        cmd.cmdType = "newPlayer";
        cmd.cmdValue = clientInfo;
        this.ncm.addCommand(cmd)
    }

    private disconnect( socket:SocketIO.Socket ){
        console.log(MyTime() + ' Client '+ socket.id + ' disconnected.');

        let cmd =  <COMMAND.Command<T.Client>>{};
        cmd.id = socket.id;
        cmd.cmdType = "playerRemove";
        cmd.cmdValue = this.game.getPlayersInfo().find(((c)=>{ return c.id===socket.id;}));
        this.ncm.addCommand(cmd)
    }

    private playerCommand( socket:SocketIO.Socket, info:COMMAND.Command<any> ){
        this.ncm.addCommand(info);
    }

    // public setPiece(blocks:THREE.Vector3[], color:number, playerId:string){
    //     // blocks.forEach((block:THREE.Vector3) =>{
    //     // let newBlock = new BLOCK.Block(block,color);
    //     // this.persistentBlocks.push(newBlock);
    //     // })
    //     // let index = this.users.findIndex((usr)=>{
    //     // return usr.id ===playerId;
    //     // })
    //     // this.users[index].generateNewPiece();
    //     // this.gl.snycClients=true;
    // }

    private sendConstantUpdates(){
      // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
        let start = Date.now();
        setInterval(()=>{
            let delta = Date.now()-start;//milliseconds elapsed since start
            let newSecond = Math.floor(delta/1000);
            this.serverTime= newSecond;
            this.ncm.pollAndProcessCommands(this.game);
        },100);
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