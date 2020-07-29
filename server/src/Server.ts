import { Socket, createConnection } from "net";
import { v4 as uuidv4 } from 'node-uuid';
import { Vector3, Quaternion, Euler} from 'three';

//LocalImports
import MyTime from './utilities/time';
import * as BLOCK from './Entities/Block'
import * as CLIENT from './Entities/Client'
import * as PIECE from './Entities/Piece'
import * as GL from './GameLogic';

interface updateInfo{
  users:CLIENT.Client[],
  persistentBlocks: BLOCK.Block[],
  serverTime:number
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

    private gameLogic: GL.GameLogic;


    //serverTime
    public currentSecond:number;

    constructor(){
      //Data storage, local only for now.
      this.persistentBlocks = [];
      this.users = [];

      //init the game logic
      this.gameLogic = new GL.GameLogic();

      //start the server
      this.initServer("80");

      //makes the server constantly broadcast messages to the clients
      this.sendConstantUpdates();

    }

    initServer(port:string){
        this.port = normalizePort(process.env.PORT || port);
        
        this.io = require('socket.io')(this.port);
        console.log(this.port);
        console.log("Listening on port: "+ this.port);

        this.io.on('connection', (socket:any)=>{
          
          this.initNewConnection(socket)

          socket.on('disconnect', ()=>this.disconnect(socket));

          socket.on('move', (info:any)=>this.move(socket,info));

          socket.on('set_blocks',(info:any)=>this.set(socket,info));

          socket.on('clearBoard', ()=>this.clearBoard());

        }); 
    }

    //on connect
    initNewConnection(socket:any){

      let info: CLIENT.Client =  new CLIENT.Client(new PIECE.Piece());
      //assign unique id
      info.id = socket.id;   
      /*
        assign piece
        put the client in our data store
        announce to the server console
      */       
      this.users.push(info);                                          
      console.log(MyTime() + ' Client '+ info.id + ' connected.');  

      //now give the client all the information
      const retObject ={
        id: info.id,
        serverTime:this.currentSecond
      }
      socket.emit('onconnected',retObject);  

      //console.log(info);

      //Inform the rest of the players we have a new connection.
      this.io.sockets.emit('updateAllPlayers', this.users);

      // socket.emit('onPlayerSetPiece', this.persistentBlocks);
    }

    //on disconnect
    disconnect(socket:any){
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
    set(newSocket:any, info:any){

        let blocks:Vector3[] = info.blocks;
        let color:number = info.color;

        blocks.forEach((block:Vector3) =>{
          
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

      const info = <updateInfo>{};
      info.users = this.users;
      info.serverTime = this.currentSecond;
      info.persistentBlocks = this.persistentBlocks;
      
      this.io.sockets.emit('UPDATE', JSON.stringify(info));


    }

    //on move
    move(newSocket:any, info:any){     

      let parsedInfo = JSON.parse(info);
      let userIndex = this.users.findIndex((usr)=>{
        if(usr!==null &&usr!==undefined){
          return usr.id===parsedInfo['id'];
        }
      });
      if(userIndex===-1){
        return;
      }
      let currentPiece: CLIENT.Client = this.users[userIndex];
      let euler = new Euler(0,0,0,"xyz");
      switch(parsedInfo['dir']){
        case 'up':
          currentPiece.position.y++;
          break;
        case 'down':
          currentPiece.position.y--;
          break;
        case 'left':
          currentPiece.position.x--;
          break;
        case 'right':
          currentPiece.position.x++;
          break;
        case 'in':
          currentPiece.position.z--;
          break;
        case 'out':
          currentPiece.position.z++;
          break;
        case 'ccw':
          euler.setFromVector3(new Vector3(0,0,Math.PI/2),"xyz");
          currentPiece['rotation'].x += euler.x;
          currentPiece['rotation'].y += euler.y;
          currentPiece['rotation'].z += euler.z;
          break;
        case 'cw':
          euler.setFromVector3(new Vector3(0,0,-Math.PI/2),"xyz");
          currentPiece['rotation'].x += euler.x;
          currentPiece['rotation'].y += euler.y;
          currentPiece['rotation'].z += euler.z;
          break;
      }

      newSocket.emit('aknowledgeMove');
      //send everyone else our update.  
      //newSocket.emit('')
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
        this.currentSecond= newSecond;

        const info = <updateInfo>{};
        info.users = this.users;
        info.serverTime = this.currentSecond;
        this.io.sockets.emit('UPDATE', JSON.stringify(info));

        this.gameLogic.lineClear(this.persistentBlocks);
   
              
      },500);
      
    }

}