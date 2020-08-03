
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
            this.socket = io('ec2-13-56-213-252.us-west-1.compute.amazonaws.com:80');
        }

        this.socket.on('onConnected', (newClient)=> this.onConnected(newClient));
        this.socket.on('UPDATE', (info)=> this.onUpdate(info));
        this.socket.on('freeControls', ()=> this.freeControls());

    }

    private onConnected(info:T.NewConnectionInfo) {
        console.log("onConnected - info:NewConnectionInfo")
        console.log(info)        
        this.game.updateNetworkInfo(info);
    }

    private onUpdate(info:any){
        let updateInfo:T.NetworkInfo = JSON.parse(info);
        this.game.updateNetworkInfo(updateInfo);
    }

    private freeControls(){
        this.engine.controlManager.freeUpControls();
        //this.game.
    }

    public sendCommand( command:COMMAND.Command<any> ){
        this.socket.emit('playerCommand', command);
    }

}