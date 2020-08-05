import * as io from 'socket.io';
import { v4 as uuidv4 } from 'node-uuid';
import * as THREE from 'three';

//LocalImports
import MyTime from './utilities/time';
import * as BLOCK from './Entities/Block'
import * as CLIENT from './Entities/Client'
import * as PIECE from './Entities/Piece'
import * as GL from './GameLogic';
import { NetworkControlManager } from "./Controls/NetworkControlManager";
import * as COMMAND from './Controls/Command';

interface UpdateInfo{
  users:CLIENT.Client[];
  persistentBlocks: BLOCK.Block[];
  serverTime:number;
}

interface NewConnectionInfo{
  users:CLIENT.Client[];
  persistentBlocks: BLOCK.Block[];
  serverTime:number;
  clientId:string;
}

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

    private port:string|number|false;
    private io: any;
    public persistentBlocks: BLOCK.Block[];
    public users: CLIENT.Client[];

    private ncm: NetworkControlManager;
    private gl: GL.GameLogic;


    //serverTime
    public serverTime:number;

    constructor(){
      //Data storage, local only for now.
      this.persistentBlocks = [];
      this.users = [];

      //init the game logic
      this.gl = new GL.GameLogic();

      //init the control manager
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
        this.gl.snycClients=true;
        console.log(this.port);
        console.log("Listening on port: "+ this.port);

        this.io.on('connection', (socket:SocketIO.Socket)=>{
          
          this.connection(socket)

          socket.on('disconnect', ()=>this.disconnect(socket));

          socket.on('playerCommand', (info)=>this.playerCommand( socket, info ));

          // socket.on('move', (info:any)=>this.move(info));

          // socket.on('set_blocks',(info:any)=>this.set(socket,info));

          // socket.on('clearBoard', ()=>this.clearBoard());

          // socket.on('forceDown', (info:any)=>this.forceDown(socket,info));

        }); 
    }

    private connection( socket:SocketIO.Socket ){

      
      
      let info: CLIENT.Client =  new CLIENT.Client(new PIECE.Piece());
      //assign unique id
      info.id = socket.id;   
      this.userSockets.set(socket.id,socket);

      this.users.push(info);                                          
      console.log(MyTime() + ' Client '+ info.id + ' connected.');  

      const newConnectionInfo = <NewConnectionInfo>{};
      newConnectionInfo.users = this.users;
      newConnectionInfo.persistentBlocks = this.persistentBlocks;
      newConnectionInfo.serverTime = this.serverTime;
      newConnectionInfo.clientId = socket.id;

      socket.emit('onConnected',newConnectionInfo);  
      console.log("emit - onConnected to: "+socket.id);
      //Add the player to the ControlManager
      this.ncm.addPlayer(info.id);

    }


    private disconnect( socket:SocketIO.Socket ){
      //Remove the player from the ControlManager
      this.ncm.removePlayer(socket.id);
      this.userSockets.delete(socket.id);

      this.users.splice(this.users.findIndex((usr)=>{
        if(usr!==null){
          console.log(MyTime() + ' Client '+ socket.id + ' disconnected.');
          socket.removeAllListeners();
          this.io.sockets.emit('onPlayerDisconnect', socket.id);
          return usr.id===socket.id;
        }
      }),1);
    }

    private playerCommand( socket:SocketIO.Socket,info:COMMAND.Command<any> ){

      console.log("recieved from: " + socket.id);
      console.log(info);


        // console.log(socket.id);
        // console.log(info);
      let newCommand = new COMMAND.Command(
        socket.id,
        info.cmdType,
        info.cmdValue);
      
      
      this.ncm.addCommand(newCommand);

    }

    public setPiece(blocks:THREE.Vector3[], color:number, playerId:string){
      blocks.forEach((block:THREE.Vector3) =>{
        let newBlock = new BLOCK.Block(block,color);
        this.persistentBlocks.push(newBlock);
      })
      let index = this.users.findIndex((usr)=>{
        return usr.id ===playerId;
      })
      this.users[index].generateNewPiece();
      this.gl.snycClients=true;


    }

    private sendConstantUpdates(){
      // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
        let start = Date.now();
          
        setInterval(()=>{
          let delta = Date.now()-start;//milliseconds elapsed since start
          let newSecond = Math.floor(delta/1000);
          this.serverTime= newSecond;

          
          this.gl.lineClear(this.persistentBlocks);
          this.ncm.pollAndProcessCommands(this.users);

          const info = <UpdateInfo>{};
          info.users = this.users;
          info.serverTime = this.serverTime;

          //check if we need to reset
          let index = this.persistentBlocks.findIndex(block=>{
            return block.position.y===19;
          })
          if(index!==-1){
            this.persistentBlocks= [];
            this.gl.snycClients=true;
            this.users.forEach(usr=>{
              usr.generateNewPiece();
            })
            
          }

          if(this.gl.snycClients===true){
            info.persistentBlocks = this.persistentBlocks; //attach persistentBlocks
            this.gl.snycClients = false;  

            console.log("Sending to all clients: " );
            console.log(info);
          }
          
          this.io.sockets.emit('UPDATE', info);
          //console.log("emit - onConnected to: "+ 'all sockets');
          //console.log(this.users[0]);

          
        },30);

        
    }
}