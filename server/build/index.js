"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = __importDefault(require("./Server"));
//TODO start backend service, and pass into the server
var gameServer = new Server_1.default();
//TODO start a chat service and connect to the clients.
