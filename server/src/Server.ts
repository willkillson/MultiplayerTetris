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

    private port:string|number|false;
    private io: any;
    private persistentBlocks: BLOCK.Block[];
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
      this.ncm = new NetworkControlManager();

      //start the server
      this.initServer("80");

      //makes the server constantly broadcast messages to the clients
      this.sendConstantUpdates();

      //TODO: remove, used for testing.
      this.testAddPiece();


    }

    initServer(port:string){
        this.port = normalizePort(process.env.PORT || port);
        this.io = require('socket.io')(this.port);
        console.log(this.port);
        console.log("Listening on port: "+ this.port);


        this.io.on('connection', (socket:SocketIO.Socket)=>{
          
          this.initNewConnection(socket)

          socket.on('disconnect', ()=>this.disconnect(socket));

          socket.on('move', (info:any)=>this.move(info));

          socket.on('set_blocks',(info:any)=>this.set(socket,info));

          socket.on('clearBoard', ()=>this.clearBoard());

          socket.on('forceDown', (info:any)=>this.forceDown(socket,info));

        }); 
    }

    //on connect
    initNewConnection( socket:SocketIO.Socket ){
      
      let info: CLIENT.Client =  new CLIENT.Client(new PIECE.Piece());
      //assign unique id
      info.id = socket.id;   

      this.users.push(info);                                          
      console.log(MyTime() + ' Client '+ info.id + ' connected.');  

      const newConnectionInfo = <NewConnectionInfo>{};
      newConnectionInfo.users = this.users;
      newConnectionInfo.persistentBlocks = this.persistentBlocks;
      newConnectionInfo.serverTime = this.serverTime;
      newConnectionInfo.clientId = socket.id;

      socket.emit('onConnected',newConnectionInfo);  

      //Add the player to the ControlManager
      this.ncm.addPlayer(info.id);

    }

    //on disconnect
    disconnect( socket:SocketIO.Socket ){
      //Remove the player from the ControlManager
      this.ncm.removePlayer(socket.id);
      this.users.splice(this.users.findIndex((usr)=>{
        if(usr!==null){
          console.log(MyTime() + ' Client '+ socket.id + ' disconnected.');
          socket.removeAllListeners();
          this.io.sockets.emit('onPlayerDisconnect', socket.id);
          return usr.id===socket.id;
        }
      }),1);
    }

    //on set
    set( socket:SocketIO.Socket, info:any){

        let blocks:THREE.Vector3[] = info.blocks;
        let color:number = info.color;

        blocks.forEach((block:THREE.Vector3) =>{
          
          let newBlock = new BLOCK.Block(block,color);
          this.persistentBlocks.push(newBlock);
        })
        //console.log(this.persistentBlocks)
        //let all the players know this block has been set in.


        let index = this.users.findIndex((usr)=>{
          return usr.id ===info.player;
        })

        this.users[index].generateNewPiece();


        this.io.sockets.emit('onPlayerSetPiece', this.persistentBlocks);

        //emit to all clients, the updated client
        this.io.sockets.emit('updateAllOtherPlayers', this.users);



    }

    //on clear board
    clearBoard(){


      this.persistentBlocks = [];

      this.users.forEach(usr=>{
        usr.generateNewPiece();
      })

      const info = <UpdateInfo>{};
      info.users = this.users;
      info.serverTime = this.serverTime;
      info.persistentBlocks = this.persistentBlocks;
      
      this.io.sockets.emit('UPDATE', JSON.stringify(info));


    }

    forceDown(newSocket:any, info:any){
      let parsedInfo = JSON.parse(info);
      let userIndex = this.users.findIndex((usr)=>{
        if(usr!==null &&usr!==undefined){
          return usr.id===parsedInfo['id'];
        }
      });
      if(userIndex===-1){
        return;
      }
      console.log(info);

      let currentPiece: CLIENT.Client = this.users[userIndex];
      currentPiece.position.y--;
    }

    /**
     * Adds a command to the NetworkControlManager's players queue.
     * 
     * @param info 
     */
    move(info:any){     

      let parsedInfo = JSON.parse(info);
      let userIndex = this.users.findIndex((usr)=>{
        if(usr!==null &&usr!==undefined){
          return usr.id===parsedInfo['id'];
        }
      });
      if(userIndex===-1){
        return;
      }

      //TODO: 
      // Need to refactor this portion to recieve the value 
      // from the user instead of hardcoding the value in the server
      // but will use this for now. The command value should be generic,
      // but here it will always be of type Vector3.
      let cmdValue = new THREE.Vector3(0,0,0);

      switch(parsedInfo['dir']){
        case 'up':
          cmdValue = new THREE.Vector3(0,1,0);
          break;
        case 'down':
          cmdValue = new THREE.Vector3(0,-1,0);
          break;
        case 'left':
          cmdValue = new THREE.Vector3(-1,0,0);
          break;
        case 'right':
          cmdValue = new THREE.Vector3(1,0,0);
          break;
        case 'in':
          cmdValue = new THREE.Vector3(0,0,-1);
          break;
        case 'out':
          cmdValue = new THREE.Vector3(0,0,1);
          break;
        case 'ccw':
          cmdValue = new THREE.Vector3(0,0,Math.PI/2);
          break;
        case 'cw':
          cmdValue = new THREE.Vector3(0,0,-Math.PI/2);
          break;
      }

      let newCommand = new COMMAND.Command(
        parsedInfo.id,
        parsedInfo.dir,
        cmdValue);
  
      this.ncm.addCommand(newCommand);
    }

    /**
     * Constantly sends updates to all clients, this needs to 
     * be a small transfer, only consistenting of the most 
     * important information to keep the games in sync.
     */
    sendConstantUpdates(){
   // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
      let start = Date.now();
        
      setInterval(()=>{
       
        
        let delta = Date.now()-start;//milliseconds elapsed since start
        
        let newSecond = Math.floor(delta/1000);
        //let newSecond = delta;

        //send with time,
        this.serverTime= newSecond;

        const info = <UpdateInfo>{};
        info.users = this.users;
        info.serverTime = this.serverTime;

        //TODO: process the commands from the ControlManager
        this.ncm.pollAndProcessCommands(this.users);

        
        
        this.gl.lineClear(this.persistentBlocks);

        if(this.gl.snycClients===true){//will be set true when linClear detects we need to clear lines
          info.persistentBlocks = this.persistentBlocks;
         // console.log(info.persistentBlocks);
          this.io.sockets.emit('UPDATE', JSON.stringify(info));
          this.gl.snycClients = false;
        }
        else{
          this.io.sockets.emit('aknowledgeMove');
          this.io.sockets.emit('UPDATE', JSON.stringify(info));//normal update
        }


   
              
      },27);
      
    }

    testAddPiece(){
      let block = new BLOCK.Block(new THREE.Vector3(2,2,0),0xffffff);
      this.persistentBlocks.push(block);
    }



}