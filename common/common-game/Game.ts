
//NodeImports
// @ts-ignore
import * as THREE from 'three';

//const LOADER = require('three/examples/jsm/loaders/GLTFLoader');
//import * as LOADER from 'three/examples/jsm/loaders/GLTFLoader';

//LocalImports
//import * as PC from './entities/Piece/PieceConstants'
import * as PIECE from './entities/Piece/Piece';

import * as BOARD from './entities/Board/board'
//import * as CM from '../Controls/ControlManager'
//import * as T from '../Utilities/types'
import * as EXT from '../common-utilities/ThreeExtension'
import * as T from '../common-utilities/types';
//import * as BLOCK from './entities/Block/Block'
//import * as COMMAND from '../Controls/Command';

import * as COMMAND from '../common-game/control/Command';


export class Game {
    
    public clientId: string|null;



    //Scene graph that contains the world.
    public scene: THREE.Scene;                
    //Different states the game can be in. Prevents race conditions.     
    public gameState: T.GameState;                   

    //Variables for controlling the rate of time, and events.
    private gameTimeVariables: T.GameTimeVariables;   

    // If this class is instantiated as a client, this will contain the local player,
    // otherwise it will be assigned null.
    private localPlayerPiece: PIECE.LocalPlayerPiece|null;  

    //NetworkPlayers
    public networkPlayers: PIECE.NetworkPlayerPiece[];

    // This is duplicate information, it will all go into the scene graph.
    private persistentBlocks: T.Block[]; 
    
    // GameVariables
    public defaultPosition: THREE.Vector3;
    public defaultRotation: THREE.Vector3;
    public frameSizeHorizontal: number;
    public frameSizeVertical: number;

    constructor(){
        this.scene = new THREE.Scene();
        //this.network = <T.NetworkInfo>{};
        this.gameState = <T.GameState>{};
        this.gameState.movPlayerDown = false;   // When true, the game will force the player to move down.
        this.gameState.waitingForUpdate = true; // When true, the game will wait for an update from the server.
        this.gameState.resetGame = false;
        this.gameState.waitingForNewPiece = false;
        //gameTime
        this.gameTimeVariables = {
            secondsPerTick: 1,
            syncTime: 0,
            previousTime: 0,
            secondsSinceLastUpdate: 0
        }
        this.clientId = null;
        this.networkPlayers = [];

        this.defaultPosition = new THREE.Vector3(0,18,0);
        this.defaultRotation = new THREE.Vector3(0,0,0);
        this.frameSizeHorizontal = 23;
        this.frameSizeVertical = 19;

		//init
        this.init();
    }


    public setInitialGameState(info:T.NewConnectionInfo){

        //Will be the UUID or SERVER.
        this.clientId = info.clientId;
        this.persistentBlocks = info.persistentBlocks;
        this.gameTimeVariables.syncTime = info.serverTime;

        if(info.clientId!=="SERVER"){
            let index = info.users.findIndex(usr=>{return usr.id===info.clientId});
            if(index===-1){
                throw console.error("info:T.NewConnectionInfo does not contain local player information.");
            }
            // Local player Client info.
            let lpci = info.users.splice(index,1)[0];
            // Create our local player piece.
            this.createLocalPlayer(lpci); 
            // Create our network players from the network player client information.
            info.users.forEach(npci=>{
                // Exclude the local player, since we created it already.
                if(lpci.id!==npci.id){
                    this.createNetworkedPlayer(npci);
                }
            });
        }
    }

    private init(){
        // // SETUP GAME
        const frame = BOARD.frame();
        frame.position.add(new THREE.Vector3(-5, 0, 0));
        // this.scene.add(BOARD.levelFloor()); // grpimd
        // this.scene.add(BOARD.sky());
        this.scene.add(frame);
        let redLight = new THREE.DirectionalLight(0xffc0cb,1);
        redLight.position.set(0,0,2);
        redLight.lookAt(0,20,0);
        let whiteLight = new THREE.DirectionalLight(0xffffff,1);
        whiteLight.position.set(0,20,0);
        whiteLight.lookAt(0,0,0);

        this.scene.add(redLight);
        this.scene.add(whiteLight);
    }

    //Tetris
    resetGame(){

        let inActivePieces = this.scene.children.filter((child)=>{
          return child.userData.entityType==='inactive_piece';
        });
        //console.log(inActivePieces);
        inActivePieces.forEach((piece)=>{
          this.scene.remove(piece);
        })

    }
    
    public isCommandPossible( command:COMMAND.Command<any>):boolean {
        return this.localPlayerPiece.validateCommand(command);
    }

    public processCommand( command:COMMAND.Command<any> ):void{
        //console.log(command);
        if(command.cmdType==="playerRemove"){
            
            this.removePlayer(command.cmdValue);
        }

        if(command.cmdType==="newPlayer"){
            this.createNetworkedPlayer(command.cmdValue);
            return;
        }

        if(this.clientId==="SERVER"){
            this.networkPlayers.forEach((p)=>{
                if(p.mesh.userData.owner===command.id){
                    p.processCommand(command);
                }
            });
            return;
        }

        if(this.clientId===command.id){
            this.localPlayerPiece.processCommand(command);
        }else{
            this.networkPlayers.forEach((p)=>{
                if(p.mesh.userData.owner===command.id){
                    p.processCommand(command);
                }
            });
        }
    }

    public createLocalPlayer( info:T.Client ):void {
        let lpp = new PIECE.LocalPlayerPiece(this.scene,info);
        this.localPlayerPiece = lpp;
    }

    public createNetworkedPlayer( info:T.Client):void {
        let npp = new PIECE.NetworkPlayerPiece(this.scene,info);
        this.networkPlayers.push(npp);
    }

    //TODO: 
    public getPlayersInfo():T.Client[]{
        let retClientInfo:T.Client[] = [];
        //loops over the scene and gather
        this.networkPlayers.forEach(nwp=>{
            retClientInfo.push(nwp.getClientInfo());
        });
        
        if(this.clientId!=="SERVER"){
            retClientInfo.push(this.localPlayerPiece.getClientInfo());
        }

        return retClientInfo;
    }

    //TODO:
    public removePlayer( client:T.Client ) {
        /*
            ******************************************
            **Places where player information is stored.
            ******************************************

            private localPlayerPiece: PIECE.LocalPlayerPiece|null;  

            //NetworkPlayers
            public networkPlayers: PIECE.NetworkPlayerPiece[];

            //Scene graph that contains the world meshs.
            public scene: THREE.Scene;       
        */

        try{
            let nwp = this.networkPlayers
            .splice(this.networkPlayers
                .findIndex(np=>{np.mesh.userData.owner===client.id}),1);
            
            this.scene.remove(nwp[0].mesh);
        }catch(error){
            console.error(error);
        }


    }

    public getPersistentBlocks(): T.Block[]{
        //    private persistentBlocks: T.Block[]; 
        return this.persistentBlocks;
    }

}