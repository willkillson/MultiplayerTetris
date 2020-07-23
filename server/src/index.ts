import { v4 as uuidv4 } from 'node-uuid';
import { Vector3, Quaternion, Euler} from 'three';

//LocalImports
import MyTime from './utilities/time';
import { Socket } from 'socket.io';

const port = normalizePort(process.env.PORT || '80');
const io = require('socket.io')(port);

console.log("Listening on port: "+port);



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
  public usersId: string;
  public position: Vec3;
  public color: string;
  constructor(pUsersId:string){
    this.usersId = pUsersId;
    this.uuid = uuidv4();
  }
}

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

let persistentBlocks:Block[] = [];
let users:Client[] = [];

io.on('connection', (client:Socket)=>{

  //tell the player they connected, giving them their id
  client.emit('onconnected',{id: client.id});   

  let newClient:Client =  new Client();

  //assign unique id
  newClient.id = client.id;   

  //assign position
  newClient.position.x = 0;   
  newClient.position.y = 18;
  newClient.position.z = -1*users.length;
  
  //assign euler angle
  newClient.rotation.x = 0;   
  newClient.rotation.y = 0;
  newClient.rotation.z = 0;

  /*
    assign piece
    put the client in our data store
    announce to the server console
  */
  newClient.pieceType = Math.floor(Math.random()*7);              
  users.push(newClient);                                          
  console.log(MyTime() + ' Client '+client.id + ' connected.');   

  client.on('disconnect',()=>{
    for(let i = 0;i< users.length;i++){
      if(users[i]!==undefined){
        if(users[i].id===client.id){
          delete users[i];
          console.log(MyTime() + ' Client '+client.id + ' disconnected.');
          client.removeAllListeners();
          return;
        }
      }
    }
  })

  client.on('set_blocks',(client)=>{
    console.log("client.on('set_blocks',(client)");
    console.log(client);
    //client.uuid = ' '+ uuidv4();
    //persistentBlocks.push(client);
  })

  client.on('move', info=>{
    let parsedInfo = JSON.parse(info);

    let currentPiece:Client = users[parsedInfo['id']];
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

    //CLAMP

  })

})

interface NetworkInfo{//This is the data being passed and forth.
  users:Client[],
  persistentblocks:Block[]
}

setInterval(()=>{
  let networkInfo = <NetworkInfo>{}
  networkInfo['users'] = users.filter((user)=>{
    if(user!==null){
      return true
    }else{
      return false;
    }
  });
  networkInfo['persistentblocks'] = persistentBlocks;

  if(persistentBlocks.length>50){
    persistentBlocks = [];
  }
  io.sockets.emit('UPDATE', JSON.stringify(networkInfo));
},50);


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val:string) {
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
