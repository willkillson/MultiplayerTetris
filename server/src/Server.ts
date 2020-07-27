import { Socket, createConnection } from "net";
import { v4 as uuidv4 } from 'node-uuid';
import { Vector3, Quaternion, Euler} from 'three';

//LocalImports
import MyTime from './utilities/time';
class Client{
  public id: string;
  public position: Vec3;
  public rotation: Vec3; //Euler angle
  public pieceType: number | null;

  constructor(piece: Piece){
    this.id = "";
    this.position = piece.position;
    this.rotation = piece.rotation;
    this.pieceType = piece.pieceType;
  }

  updatePiece(piece: Piece){
    this.position = piece.position;
    this.rotation = piece.rotation;
    this.pieceType = piece.pieceType;
  }

  generateNewPiece(){
    this.updatePiece(new Piece());
  }

}

class Piece{
  public position: Vector3;
  public rotation: Vector3;
  public pieceType: number;

  constructor(){
      //assign position
      this.position = new Vector3(0,0,0);
      
      //assign euler angle
      this.rotation = new Vector3(0,0,0);

      this.pieceType = Math.floor(Math.random()*7);            
  }



}

class Vec3{
  public x: number;
  public y: number;
  public z: number;

  constructor(){
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
}

class Block{

  public uuid: string;
  public position: Vector3;
  public color: number;

  constructor(pPosition:Vector3, pColor:number){
    this.position = pPosition;
    this.color = pColor;
    this.uuid = uuidv4();
  }
}

interface updateInfo{
  users:Client[]
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
    private persistentBlocks:Block[];
    public users:Client[];

    constructor(){
      //Data storage, local only for now.
      this.persistentBlocks = [];
      this.users = [];

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

        }); 
    }

    //on connect
    initNewConnection(socket:any){

      let info:Client =  new Client(new Piece());
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
        users:this.users
      }
      socket.emit('onconnected',retObject);  

      console.log(info);

      //Inform the rest of the players we have a new connection.
      this.io.sockets.emit('onNewPlayer', info);
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
      console.log("set(newSocket:any, info:any)");
      console.log(info);
     //console.log(info); 
     let blocks:Vector3[] = info.blocks;
     let color:number = info.color;

     blocks.forEach((block:Vector3) =>{
       
        let newBlock = new Block(block,color);
        this.persistentBlocks.push(newBlock);
     })
     console.log(this.persistentBlocks)
     //let all the players know this block has been set in.


     let index = this.users.findIndex((usr)=>{
       return usr.id ===info.player;
     })
     
     this.users[index].generateNewPiece();


     this.io.sockets.emit('onPlayerSetPiece', this.persistentBlocks);


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
      let currentPiece:Client = this.users[userIndex];
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

      //send everyone else our update.  
      //newSocket.emit('')
    }

    /**
     * Constantly sends updates to all clients, this needs to 
     * be a small transfer, only consistenting of the most 
     * important information to keep the games in sync.
     */
    sendConstantUpdates(){
      setInterval(()=>{
        
      const info = <updateInfo>{};
      info.users = this.users;
      this.io.sockets.emit('UPDATE', JSON.stringify(info));
      },50);
      
    }

}
