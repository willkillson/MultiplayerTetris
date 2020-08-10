
//NodeImports
import * as io from 'socket.io-client';

//LocalImports
import * as GAME from '../../common-game/Game';
import * as T from '../../common-utilities/types'
import * as COMMAND from '../../common-game/control/Command';
import {Engine} from '../Engine';

export class ClientNetwork {

    ////Networking
    public clientId: any;
    private socket: any;
    private engine:any;

    constructor( isDevelop:any, engine:any ){
        this.clientId = '';
        this.engine = engine;
        
        if (isDevelop) {
            this.socket = io.connect('http://localhost/');
        } else {
            this.socket = io.connect('willkillson.ddns.net:80');
        }

        this.socket.on('onConnected', (newClient:any)=> this.onConnected(newClient));
        this.socket.on('onCommand', (info:any)=> this.receiveCommand(info));
    }

    private onConnected(info:T.NewConnectionInfo) {   
        console.log("onConnected - info:T.NewConnectionInfo");
        console.log({info});
        this.engine.game.setInitialGameState(info);
    }

    public sendCommand( command:COMMAND.Command<any> ){
        console.log("public sendCommand( command:COMMAND.Command<any> )");
        console.log({command});
        // @ts-ignore
        command.id = this.engine.game.clientId;
        this.socket.emit('playerCommand', command);

    }

    public receiveCommand( command:COMMAND.Command<any> ){
        console.log("public receiveCommand( command:COMMAND.Command<any> )");
        console.log({command});
        this.engine.networkCommandManager.queCommand(command);
        //this.engine.game.processCommand(command);
    }

}