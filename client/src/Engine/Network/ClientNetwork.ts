
//NodeImports
import * as io from 'socket.io-client';

//LocalImports
import * as GAME from '../../common-game/Game';
import * as T from '../../common-utilities/types'
import * as COMMAND from '../../common-game/control/Command';
import Engine from '../Engine';

export class ClientNetwork {

    ////Networking
    public clientId: string|null;
    private socket: SocketIO.Socket;
    private game: GAME.Game;

    private engine:Engine;

    constructor( isDevelop:boolean, engine:Engine ){
        this.clientId = null;
        this.socket = null;
        this.game = engine.game;
        this.engine = engine;
        
        if (isDevelop) {
            this.socket = io('192.168.1.2:80');
        } else {
            this.socket = io('willkillson.ddns.net:80');
        }

        this.socket.on('onConnected', (newClient)=> this.onConnected(newClient));
        this.socket.on('UPDATE', (info)=> this.onUpdate(info));
        //this.socket.on('freeControls', ()=> this.freeControls());
        this.socket.on('clearWaitingFlag', ()=> this.clearWaitingFlag());
        this.socket.on('clearWaitingForNewPiece', (info)=> this.clearWaitingForNewPiece(info));
        this.socket.on('onCommand', (info)=> this.receiveCommand(info));

    }

    private onConnected(info:T.NewConnectionInfo) {   
        console.log("onConnected - info:T.NewConnectionInfo");
        console.log(info);
        this.game.setInitialGameState(info);
    }


    private onUpdate(info:T.NewConnectionInfo){
            //TODO: Refactor
        //this.game.updateNetworkInfo(info);
    }

    private clearWaitingFlag(){
        this.game.gameState.waitingForUpdate=false;
    }

    // private freeControls(){
    //     this.engine.controlManager.freeUpControls();
    // }

    public sendCommand( command:COMMAND.Command<any> ){
        command.id = this.engine.game.clientId;
        this.socket.emit('playerCommand', command);
        console.log("sendCommand - command:command:COMMAND.Command<any> ");
        console.log(command);
    }

    public receiveCommand( command:COMMAND.Command<any> ){
        console.log("receiveCommand - command:command:COMMAND.Command<any> ");
        console.log(command.id);
        this.engine.networkCommandManager.queCommand(command);
        //this.game.processCommand(command);
    }

    clearWaitingForNewPiece(info:T.NewConnectionInfo): void {
        this.onUpdate(info);
        this.game.gameState.waitingForNewPiece = false;
    }

}