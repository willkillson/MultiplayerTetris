
//NodeImports
import * as io from 'socket.io-client';

//LocalImports
import * as GAME from '../Game/Game';
import * as T from '../Util/types'
import * as COMMAND from '../Controls/Command';
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
        this.socket.on('freeControls', ()=> this.freeControls());
        this.socket.on('clearWaitingFlag', ()=> this.clearWaitingFlag());

    }

    private onConnected(info:T.NewConnectionInfo) {   
        this.game.updateNetworkInfo(info);
    }

    private onUpdate(info:any){
        let updateInfo:T.NetworkInfo = JSON.parse(info);
        this.game.updateNetworkInfo(updateInfo);
    }

    private clearWaitingFlag(){
        this.game.gameState.waitingForUpdate=false;
    }

    private freeControls(){
        this.engine.controlManager.freeUpControls();
    }

    public sendCommand( command:COMMAND.Command<any> ){
        this.socket.emit('playerCommand', command);
    }

}