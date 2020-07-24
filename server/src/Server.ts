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

  constructor(){
    this.id = "";
    this.position = new Vec3();
    this.rotation = new Vec3();
    this.pieceType = null;
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
  public pUserPosition: string;
  public position: Vec3;
  public color: string;

  constructor(pUserPosition:string){
    this.pUserPosition = pUserPosition;
    this.uuid = uuidv4();
  }
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
    private users:Client[];


    constructor(){
      //Data storage, local only for now.
      this.persistentBlocks = [];
      this.users = [];

      //start the server
      this.initServer("80");

      //makes the server constantly broadcast messages to the clients
      //this.sendConstantUpdates();
    }

    initServer(port:string){
        this.port = normalizePort(process.env.PORT || port);
        
        this.io = require('socket.io')(this.port);
        console.log(this.port);
        console.log("Listening on port: "+ this.port);

        this.io.on('connection', (socket:any)=>{
          
          //console.log(socket);
          this.initNewConnection(socket)

        }); 
    }

    //on connect
    initNewConnection(socket:any){

      let info:Client =  new Client();
      //assign unique id
      info.id = socket.id;   

      //assign position
      info.position.x = 0;   
      info.position.y = 18;
      info.position.z = -1*this.users.length;
      
      //assign euler angle
      info.rotation.x = 0;   
      info.rotation.y = 0;
      info.rotation.z = 0;
  
      /*
        assign piece
        put the client in our data store
        announce to the server console
      */
      info.pieceType = Math.floor(Math.random()*7);              
      this.users.push(info);                                          
      console.log(MyTime() + ' Client '+ info.id + ' connected.');  

      //now give the client all the information
      
      const retObject ={
        id: info.id,
        users:this.users
      }

      socket.emit('onconnected',retObject);   
    }

    //on disconnect
    disconnect(newSocket:any){
      for(let i = 0;i< this.users.length;i++){
        if(this.users[i]!==undefined){
          if(this.users[i].id===newSocket.id){
            delete this.users[i];
            console.log(MyTime() + ' Client '+ newSocket.id + ' disconnected.');
            newSocket.removeAllListeners();
            return;
          }
        }
      }

    }

    //on move
    move(newSocket:any){
      console.log(newSocket);
      // let parsedInfo = JSON.parse(info);

      // let currentPiece:Client = users[parsedInfo['id']];
      // let euler = new Euler(0,0,0,"xyz");
      // switch(parsedInfo['dir']){
      //   case 'up':
      //     currentPiece.position.y++;
      //     break;
      //   case 'down':
      //     currentPiece.position.y--;
      //     break;
      //   case 'left':
      //     currentPiece.position.x--;
      //     break;
      //   case 'right':
      //     currentPiece.position.x++;
      //     break;
      //   case 'in':
      //     currentPiece.position.z--;
      //     break;
      //   case 'out':
      //     currentPiece.position.z++;
      //     break;
      //   case 'ccw':
      //     euler.setFromVector3(new Vector3(0,0,Math.PI/2),"xyz");
      //     currentPiece['rotation'].x += euler.x;
      //     currentPiece['rotation'].y += euler.y;
      //     currentPiece['rotation'].z += euler.z;
      //     break;
      //   case 'cw':
      //     euler.setFromVector3(new Vector3(0,0,-Math.PI/2),"xyz");
      //     currentPiece['rotation'].x += euler.x;
      //     currentPiece['rotation'].y += euler.y;
      //     currentPiece['rotation'].z += euler.z;
      //     break;
      
  
      //CLAMP//new change
    }

    /**
     * Constantly sends updates to all clients, this needs to 
     * be a small transfer, only consistenting of the most 
     * important information to keep the games in sync.
     */
    sendConstantUpdates(){
      setInterval(()=>{
      //   console.log("Running...");
      //   let networkInfo = ():NetworkInfo =>({
      //     users:this.users.filter((user)=>{
      //       if(user!==null){
      //         return true
      //       }else{
      //         return false;
      //       }
      //     })
      //   })
      // this.io.sockets.emit('UPDATE', JSON.stringify(networkInfo));
      },1000);
      
    }
}