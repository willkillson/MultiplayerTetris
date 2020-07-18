var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var io = require('socket.io')(80);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { isObject } = require('util');
const { parse } = require('path');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let users = {};
let userCount = 0;

io.on('connection', (client)=>{




  //tell the player they connected, giving them their id
  client.emit('onconnected',{id: client.id});
  
  let clientInfo = {};
  clientInfo['position_x'] = 0;
  clientInfo['position_y'] = 18;
  clientInfo['position_z'] = userCount;
  clientInfo['piece_type'] = Math.floor(Math.random()*7);

  userCount++;

  users[client.id] = clientInfo;

  console.log('Client '+client.id + ' connected.');

  client.on('disconnect',()=>{
    userCount--;
    //delete users[client.id];
    console.log('Client '+client.id + ' disconnected.');
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

setInterval(()=>{
  console.log(users);
  
},10000);



module.exports = app;
