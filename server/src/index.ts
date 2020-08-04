import Server from './Server'

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
 
//https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.listen(8000);

let gameServer = new Server();

//TODO start a chat service and connect to the clients.