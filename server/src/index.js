import express from 'express';
import THREE from 'three';

//LocalImports
import MyTime from './utilities/time';


const app = express();
const io = require('socket.io')(80);
const http = require('http');
const port = normalizePort(process.env.PORT || '1337');

app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error',onError);
server.on('listening', onListening);


let users = {};
let userCount = 0;

io.on('connection', (client)=>{

  //tell the player they connected, giving them their id
  client.emit('onconnected',{id: client.id});
  
  let clientInfo = {};
  clientInfo['position_x'] = 0;
  clientInfo['position_y'] = 18;
  clientInfo['position_z'] = -1*userCount++;
  clientInfo['piece_type'] = Math.floor(Math.random()*7);

  

  users[client.id] = clientInfo;
  
  console.log(MyTime() + ' Client '+client.id + ' connected.');

  client.on('disconnect',()=>{
    userCount--;
    delete users[client.id];

    console.log(MyTime() + ' Client '+client.id + ' disconnected.');
    client.removeAllListeners();
  })

  client.on('join',(msg)=>{
    console.log(msg);
  })

  client.on('say',(client)=>{
    console.log(client);
  })

  client.on('move', info=>{
    let parsedInfo = JSON.parse(info);
    let currentPiece = users[parsedInfo['id']];
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
    }
  })

})

setInterval(()=>{
  //console.log("Sending_UPDATE: "+JSON.stringify(users));
  io.sockets.emit('UPDATE', JSON.stringify(users));
},100);


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

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}
