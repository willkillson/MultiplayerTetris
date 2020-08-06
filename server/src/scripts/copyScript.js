
let fs = require('fs');

console.log("Copying game files from client to server.");

//WONT WORK???
 fs.copyFile('./../client/src/Engine/Game/Game.ts','./src/Game',(exception)=>{
     console.log("***Error occured***");
     console.log(exception.message);
 })

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
