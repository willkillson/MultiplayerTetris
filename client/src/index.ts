// main.js
// Import app and BrowserWindow
const { app, BrowserWindow } = require('electron');

// When Electron has finished initializing after import, run the window creation function
app.on('ready', function(){

   // Browser window actually creates the window (Create and control browser windows.)
   let win = new BrowserWindow({ width: 1280, height: 720 });

   // Load the HTML file into the Window
   win.loadFile('../html/hello.html');
   

});