
let fs = require('fs');

let ncp = require('ncp').ncp;


console.log("Copying common Game folder from ./../common/common-game/ to './src/common-game'");
ncp('./../common/common-game/', './src/common-game', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('done!');
 });

 console.log("Copying common utilities folder from ./../common/common-utilities/ to ./src/common-utilities/");
 ncp('./../common/common-utilities/', './src/common-utilities/', function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('done!');
 });

// console.log("Copying game files from client to server.");
// fs.createReadStream('./../client/src/Engine/Game/Game.ts').pipe(fs.createWriteStream('./src/Game/Game.ts'));

//WONT WORK???
//  fs.copyFile('./../client/src/Engine/Game/Game.ts','./src/Game',(exception)=>{
//      console.log("***Error occured***");
//      console.log(exception.message);
//  })

//fs.copyFile('poop.txt','',(exception)=>{
 //   console.log("***Error occured***");
  //  console.log(exception.message);
//})


// fs.readdir('./src/Game', (err, files) => { 
//     if (err) 
//       console.log(err); 
//     else { 
//       console.log("\nCurrent directory filenames:"); 
//       files.forEach(file => { 
//         console.log(file); 
//       }) 
//     } 
//   }) 




/*

{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start:dev": "nodemon",
    "prestart": "node ./src/scripts/copyScript.js",
    "build": "rimraf ./build && tsc",
    "start": "node build && node build/index.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^14.0.24",
    "@types/node-uuid": "0.0.28",
    "@types/socket.io": "^2.1.10",
    "node-uuid": "^1.4.8",
    "nodemon": "^2.0.4",
    "rimraf": "^3.0.2",
    "socket.io": "^2.3.0",
    "three": "^0.118.3",
    "ts-node": "^8.10.2",
    "typescript": "^3.9.7"
  },
  "dependencies": {
    "@types/socket.io-client": "^1.4.33",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "ncp": "^2.0.0"
  }
}



*/
