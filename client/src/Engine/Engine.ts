
import * as THREE from 'three';

//LocalImports
import * as GRAPHICS from './Graphics/Graphics';
import * as NETWORK from './Network/ClientNetwork'

import * as CONTROLMANAGER from './Controls/ControlManager';
import * as KEYBOARDCONTROLS from './Controls/KeyboardControls';
import * as ONSCREENCONTROLS from './Controls/OnscreenControls';
import * as T from '../common-utilities/types';

import * as GAME from '../common-game/Game'


export class Engine {

    private IS_DEVELOP: boolean;

    public network: NETWORK.ClientNetwork;
    public game:GAME.Game;


    private graphics:GRAPHICS.Graphics;
    public localCommandManager: CONTROLMANAGER.ControlManager;
    public networkCommandManager: CONTROLMANAGER.ControlManager;
    private keyboardControls: KEYBOARDCONTROLS.KeyboardControls;
    private onscreenControls: ONSCREENCONTROLS.OnscreenControls;

  constructor(){
    // MAKE SURE TO SET THIS TO FALSE WHEN PUSHING TO MASTER FOR A NEW BUILD
    this.IS_DEVELOP = true;
    ////GRAPICS
    ////////////////////
    this.graphics = new GRAPHICS.Graphics(this);
    ////GAME
    ////////////////////
    const isClient = true;
 

    
    ////NETWORK
    ////////////////////
    this.network = new NETWORK.ClientNetwork(this.IS_DEVELOP, this);
    this.game = new GAME.Game();



    ////CONTROLS
    ////////////////////    
    this.localCommandManager = new CONTROLMANAGER.ControlManager(this);
    this.networkCommandManager = new CONTROLMANAGER.ControlManager(this);
    this.keyboardControls = new KEYBOARDCONTROLS.KeyboardControls(this.localCommandManager);
    this.onscreenControls = new ONSCREENCONTROLS.OnscreenControls(this.localCommandManager);  

    // @ts-ignore
    document.getElementById("root")?.appendChild(this.graphics.renderer.domElement);
    ////StartMainGameLoop
    ////////////////////
    this.graphics.start();
    console.log("HelloWorld!");
  }

  private initSinglePlayer(){
        //////////////////
        //SinglePlayer
        ///////////////
        let singlePlayer = <T.Client>{};
        singlePlayer.id = "zRdH7CtEor4p384cAAAC";
        singlePlayer.position = new THREE.Vector3(5,5,0);
        singlePlayer.rotation = new THREE.Vector3(0,0,0);
        singlePlayer.pieceType = 0;
        let conn = <T.NewConnectionInfo>{};
        conn.clientId = "zRdH7CtEor4p384cAAAC";
        conn.persistentBlocks = [];
        conn.serverTime = 0;
        conn.users = [];
        conn.users.push(singlePlayer);
        this.game.setInitialGameState(conn);
  }
    
}

const engine = new Engine();