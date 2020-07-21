import express from 'express';
import { v4 as uuidv4 } from 'node-uuid';
import { Vector3, Quaternion, Euler} from 'three';

//LocalImports
import MyTime from './utilities/time';


//const app = express();
//const port = normalizePort(process.env.PORT || '8337');
const port = normalizePort(process.env.PORT || '80');
const io = require('socket.io')(port);
//const http = require('http');


// app.set('port', port);
// const server = http.createServer(app);

//server.listen(port);
console.log("Listening on port: "+port);

//server.on('error',onError);
//server.on('listening', onListening);


let users = {};
let userCount = 0;

let persistentBlocks = [];

io.on('connection', (client)=>{

  //tell the player they connected, giving them their id
  client.emit('onconnected',{id: client.id});
  
  let clientInfo = {};
  clientInfo['position_x'] = 0;
  clientInfo['position_y'] = 18;
  clientInfo['position_z'] = -1*userCount++;
  clientInfo['rotation'] ={
      'x': 0,
      'y': 0,
      'z': 0
  };
  clientInfo['piece_type'] = Math.floor(Math.random()*7);
  

  

  users[client.id] = clientInfo;
  
  console.log(MyTime() + ' Client '+client.id + ' connected.');

  client.on('disconnect',()=>{
    userCount--;
    delete users[client.id];

    console.log(MyTime() + ' Client '+client.id + ' disconnected.');
    client.removeAllListeners();
  })

  client.on('set_blocks',(client)=>{
    client.uuid = ' '+ uuidv4();

    persistentBlocks.push(client);
  })

  client.on('move', info=>{
    let parsedInfo = JSON.parse(info);
    let currentPiece = users[parsedInfo['id']];
    let euler = new Euler(0,0,0,"xyz");
    switch(parsedInfo['dir']){
      case 'up':
        currentPiece['position_y']++;
        break;
      case 'down':
        currentPiece['position_y']--;
        break;
      case 'left':
        currentPiece['position_x']--;
        break;
      case 'right':
        currentPiece['position_x']++;
        break;
      case 'in':
        currentPiece['position_z']--;
        break;
      case 'out':
        currentPiece['position_z']++;
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

setInterval(()=>{
  //console.log("Sending_UPDATE: "+JSON.stringify(users));
  let networkInfo = {};
  networkInfo['users'] = users;
  networkInfo['persistentblocks'] = persistentBlocks;
  io.sockets.emit('UPDATE', JSON.stringify(networkInfo));
},10);


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
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
