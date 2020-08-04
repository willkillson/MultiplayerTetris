"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = __importDefault(require("./Server"));
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
//https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.listen(8000);
var gameServer = new Server_1.default();
//TODO start a chat service and connect to the clients.
