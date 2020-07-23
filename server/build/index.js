"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_uuid_1 = require("node-uuid");
var three_1 = require("three");
//LocalImports
var time_1 = __importDefault(require("./utilities/time"));
var port = normalizePort(process.env.PORT || '80');
var io = require('socket.io')(port);
console.log("Listening on port: " + port);
var Vec3 = /** @class */ (function () {
    function Vec3() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    return Vec3;
}());
var Block = /** @class */ (function () {
    function Block(pUsersId) {
        this.usersId = pUsersId;
        this.uuid = node_uuid_1.v4();
    }
    return Block;
}());
var Client = /** @class */ (function () {
    function Client() {
        this.id = "";
        this.position = new Vec3();
        this.rotation = new Vec3();
        this.pieceType = null;
    }
    return Client;
}());
var persistentBlocks = [];
var users = [];
io.on('connection', function (client) {
    //tell the player they connected, giving them their id
    client.emit('onconnected', { id: client.id });
    var newClient = new Client();
    //assign unique id
    newClient.id = client.id;
    //assign position
    newClient.position.x = 0;
    newClient.position.y = 18;
    newClient.position.z = -1 * users.length;
    //assign euler angle
    newClient.rotation.x = 0;
    newClient.rotation.y = 0;
    newClient.rotation.z = 0;
    /*
      assign piece
      put the client in our data store
      announce to the server console
    */
    newClient.pieceType = Math.floor(Math.random() * 7);
    users.push(newClient);
    console.log(time_1.default() + ' Client ' + client.id + ' connected.');
    client.on('disconnect', function () {
        for (var i = 0; i < users.length; i++) {
            if (users[i] !== undefined) {
                if (users[i].id === client.id) {
                    delete users[i];
                    console.log(time_1.default() + ' Client ' + client.id + ' disconnected.');
                    client.removeAllListeners();
                    return;
                }
            }
        }
    });
    client.on('set_blocks', function (client) {
        console.log("client.on('set_blocks',(client)");
        console.log(client);
        //client.uuid = ' '+ uuidv4();
        //persistentBlocks.push(client);
    });
    client.on('move', function (info) {
        var parsedInfo = JSON.parse(info);
        var currentPiece = users[parsedInfo['id']];
        var euler = new three_1.Euler(0, 0, 0, "xyz");
        switch (parsedInfo['dir']) {
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
                euler.setFromVector3(new three_1.Vector3(0, 0, Math.PI / 2), "xyz");
                currentPiece['rotation'].x += euler.x;
                currentPiece['rotation'].y += euler.y;
                currentPiece['rotation'].z += euler.z;
                break;
            case 'cw':
                euler.setFromVector3(new three_1.Vector3(0, 0, -Math.PI / 2), "xyz");
                currentPiece['rotation'].x += euler.x;
                currentPiece['rotation'].y += euler.y;
                currentPiece['rotation'].z += euler.z;
                break;
        }
        //CLAMP
    });
});
setInterval(function () {
    var networkInfo = {};
    networkInfo['users'] = users.filter(function (user) {
        if (user !== null) {
            return true;
        }
        else {
            return false;
        }
    });
    networkInfo['persistentblocks'] = persistentBlocks;
    if (persistentBlocks.length > 50) {
        persistentBlocks = [];
    }
    io.sockets.emit('UPDATE', JSON.stringify(networkInfo));
}, 50);
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
