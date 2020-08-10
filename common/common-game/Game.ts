
//NodeImports
// @ts-ignore
import * as THREE from 'three';
//const LOADER = require('three/examples/jsm/loaders/GLTFLoader');
//import * as LOADER from 'three/examples/jsm/loaders/GLTFLoader';

//LocalImports
//import * as PC from './entities/Piece/PieceConstants'
import * as PIECE from './entities/Piece/Piece';
import * as BLOCK from './entities/Block/Block';
import * as BOARD from './entities/Board/board'
//import * as CM from '../Controls/ControlManager';
//import * as T from '../Utilities/types'
import * as EXT from '../common-utilities/ThreeExtension'
import * as T from '../common-utilities/types';
//import * as COMMAND from '../Controls/Command';

import * as COMMAND from '../common-game/control/Command';



export class Game {
    
    public clientId: string;

    //Scene graph that contains the world.
    public scene: THREE.Scene;                
    //Different states the game can be in. Prevents race conditions.     
    public gameState: T.GameState;                   

    //Variables for controlling the rate of time, and events.
    private gameTimeVariables: T.GameTimeVariables;   

    // If this class is instantiated as a client, this will contain the local player,
    // otherwise it will be assigned null.
    public localPlayerPiece: PIECE.LocalPlayerPiece|undefined;  

    //NetworkPlayers
    public networkPlayers: PIECE.NetworkPlayerPiece[];

    // This is duplicate information, it will all go into the scene graph.
    // @ts-ignore
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
        this.clientId = '';
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
        inActivePieces.forEach((piece)=>{
          this.scene.remove(piece);
        })

    }
    
    public isCommandPossible( command:COMMAND.Command<any>):boolean {

        if(command.cmdType==="rotation" || command.cmdType === "movement"){
            // @ts-ignore
            return this.localPlayerPiece.validateCommand(command);
        }else{
            return true;
        }
    }

    public processCommand( command:COMMAND.Command<any> ) {

        /*
            cmd.cmdType        cmd.cmdValue
            'setPiece'    |     Client: denotes position the piece is in.
            'rotation'    |     Vector3: the rotation applied to the euler vec
            'movement'    |     Vector3: denotes the direction to add to the current position
            'newPlayer'   |     Client: 
            'playerRemove' |    Client:
            'newPiece' |        Client:
        */
        switch(command.cmdType){
            case "setPiece":
                {
                    this.setPiece(command.cmdValue);
                    break;
                }
            case "rotation":
                {
                    this.rotation(command);
                    break;
                }
            case "movement":
                {
                    this.movement(command);
                    break;
                }
            case "newPlayer":
                {
                    this.createNetworkedPlayer(command.cmdValue);
                    break;
                }
            case "playerRemove":
                {
                    this.playerRemove(command.cmdValue);
                    break;
                }
            case "newPiece":
                {
                    this.newPiece(command.cmdValue);
                }
        }
    }

    //////////////////////

    //Command Functions
    
    //////////////////////

    /**
     * Is called when the command newPiece is processed. This command is activated once a piece is set.
     * 
     * @param info T.Client
     */
    public newPiece( info:T.Client ):void {
        if(info.id===this.clientId){
            this.localPlayerPiece = new PIECE.LocalPlayerPiece(this.scene,info);
            this.gameState.waitingForNewPiece=false;
        }else{
            let index = this.networkPlayers.findIndex((e)=>{return e.getClientInfo().id===info.id});
            this.networkPlayers.splice(index,1);
            let newPlayerPiece = new PIECE.NetworkPlayerPiece(this.scene, info);
            this.networkPlayers.push(newPlayerPiece);
        }
    }

    public createLocalPlayer( info:T.Client ):void {

        if(this.clientId==="SERVER"){
            throw Error("createLocalPlayer should not be called on the server!");
        }
        let lpp = new PIECE.LocalPlayerPiece(this.scene,info);
        this.localPlayerPiece = lpp;
    }

    public createNetworkedPlayer( info:T.Client):void {

        let npp = new PIECE.NetworkPlayerPiece(this.scene,info);
        this.networkPlayers.push(npp);
    }

    public setPiece(info:T.Client):void {

        let userData = <T.UserData>{};
        userData.entityType = "persistentBlock"
        userData.owner = info.id;
        // @ts-ignore
        userData.pieceType = info.pieceType;
        userData.clientInfo = info

        let blocks;
        // Remove the player's mesh from the scene, and gather the blocks to be set.
        if(info.id===this.clientId){
            //local player
            // @ts-ignore
            this.scene.remove(this.localPlayerPiece.mesh);
            // @ts-ignore
            blocks = EXT.getRotatedBlocksFromMesh(this.localPlayerPiece.mesh);
            // @ts-ignore
            blocks = EXT.bakeInOrigin(blocks, this.localPlayerPiece.mesh.position);
            for(const b of blocks){
                BLOCK.createBlock( this.scene, userData, b);
            }
            this.gameState.waitingForNewPiece = true;
        }
        else {
            //server or networked other players
            let nwp = this.networkPlayers.find(e=>{return e.getClientInfo().id===info.id});
            // @ts-ignore
            this.scene.remove(nwp.mesh);
            // @ts-ignore
            blocks = EXT.getRotatedBlocksFromMesh(nwp.mesh);
            // @ts-ignore
            blocks = EXT.bakeInOrigin(blocks, nwp.mesh.position);
            for(const b of blocks){
                BLOCK.createBlock( this.scene, userData, b);
            }    
        }
 
    }

    public playerRemove( client:T.Client ) {
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
            let index = this.networkPlayers.findIndex(np=>{ return np.mesh.userData.owner===client.id});
            if(index === -1){
                throw console.error("playerRemove: "+client.id +" does not exist in this.networkPlayers");
            }
            let nwp = this.networkPlayers.splice(index,1);

            this.scene.remove(nwp[0].mesh);
        }catch(error){
            console.error(error);
        }
    }

    public movement( cmd:COMMAND.Command<THREE.Vector3> ) {
        if(this.clientId!=="SERVER" && this.clientId===cmd.id){
            // We have the local player that is moveing.
            // @ts-ignore
           // if(this.localPlayerPiece.validateCommand(cmd)){
            // @ts-ignore
            this.localPlayerPiece.processCommand(cmd);
          //  }

        }
        else
        {
            let index = this.networkPlayers.findIndex((p)=>{return p.getClientInfo().id===cmd.id});
            if(index===-1){
                throw Error("Error, server does not contain this user in this.networkPlayers.");
            }
            let np = this.networkPlayers[index];
            np.processCommand(cmd);
        }
    }

    public rotation( cmd:COMMAND.Command<THREE.Vector3> ):boolean {
        
        return false;
    }



    //TODO: 
    public getPlayersInfo():T.Client[]{
        let retClientInfo:T.Client[] = [];
        //loops over the scene and gather
        this.networkPlayers.forEach(nwp=>{
            retClientInfo.push(nwp.getClientInfo());
        });
        
        if(this.clientId!=="SERVER"){
                        // @ts-ignore
            retClientInfo.push(this.localPlayerPiece.getClientInfo());
        }

        return retClientInfo;
    }



    public getPersistentBlocks(): T.Block[]{
        //    private persistentBlocks: T.Block[]; 
        return this.persistentBlocks;
    }

}