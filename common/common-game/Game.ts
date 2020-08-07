
//NodeImports
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
//import {GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
    private localPlayer: T.Client|null;
    private localPlayerPiece: PIECE.LocalPlayerPiece|null;                

    // This is duplicate information, it will all go into the scene graph.
    private persistentBlocks: T.Block[]; 

    // An array containing all the players in the game.               
    private players: T.Client[];  
    
    // GameVariables
    private startingPosition: THREE.Vector3;
    private defaultRotation: THREE.Vector3;
    private frameSizeHorizontal: number;
    private frameSizeVertical: number;

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

        this.startingPosition = new THREE.Vector3(0,18,0);
        this.defaultRotation = new THREE.Vector3(0,18,0);
        this.frameSizeHorizontal = 23;
        this.frameSizeVertical = 19;

        this.init();
    }


    public setInitialGameState(info:T.NewConnectionInfo){
        this.clientId = info.clientId;
        this.persistentBlocks = info.persistentBlocks;
        this.players = info.users;
        this.gameTimeVariables.syncTime = info.serverTime;

        if(info.clientId!=="SERVER"){
            // Local player initialization.
            this.localPlayer = info.users.filter(usr=>{return usr.id===info.clientId})[0];
            this.localPlayerPiece = new PIECE.LocalPlayerPiece(this.scene, this.localPlayer);    
        }else{
            // Server doesn't instantiate these.
            this.localPlayer = null;
            this.localPlayerPiece = null;
        }
        console.log(this.localPlayer);
    }

    init(){
        // SETUP GAME
        const frame = BOARD.frame();
        
        frame.position.add(new THREE.Vector3(-5, 0, 0));
        this.scene.add(BOARD.levelFloor()); // grpimd
        this.scene.add(BOARD.sky());
        this.scene.add(frame);

        let redLight = new THREE.DirectionalLight(0xffc0cb,1);
        redLight.position.set(0,0,2);
        redLight.lookAt(0,20,0);

        let whiteLight = new THREE.DirectionalLight(0xffffff,1);
        whiteLight.position.set(0,20,0);
        whiteLight.lookAt(0,0,0);
        
        // loader.load('./assets/Tree_2.glb',
        // ( gltf )=>{
        //   gltf.scene.position.set(5,5,5);
        //   this.scene.add(gltf.scene);
        // });

      //      https://github.com/mrdoob/three.js/raw/dev/examples/models/gltf/Flamingo.glb
      //      https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf
      
      //let loader = new GLTFLoader();
      
      // loader.load('http://69.254.195.147:8000/Stork.glb',
      //   ( gltf )=>{
      //     //on load
      //     const model = gltf.scene.children[0];
      //     model.position.set(-40,5,-10);
      //     model.scale.setScalar(0.2);
      //     model.rotation.set(0,Math.PI/2,0);
      //     const animation  = gltf.animations[0];
      //     const mixer = new THREE.AnimationMixer( model );
      //     this.mixers.push( mixer );
      //     const action = mixer.clipAction( animation );
      //     action.play();
      //     this.scene.add( model );

      // },()=>{},(event)=>{console.log(event.message)});
      // loader.load('http://69.254.195.147:8000/Flamingo.glb',
      //   ( gltf )=>{
      //     const model = gltf.scene.children[0];
      //     model.position.set(-60,30,-20);
      //     model.scale.setScalar(0.1);
      //     model.rotation.set(0,Math.PI/2,0);
      //     const animation  = gltf.animations[0];
      //     const mixer = new THREE.AnimationMixer( model );
      //     this.mixers.push( mixer );
      //     const action = mixer.clipAction( animation );
      //     action.play();
      //     this.scene.add( model );
      // },()=>{},(event)=>{console.log(event.message)});

      // loader.load('http://69.254.195.147:8000/Parrot.glb',
      //   ( gltf )=>{
      //     const model = gltf.scene.children[0];
      //     model.position.set(70,40,-30);
      //     model.scale.setScalar(0.3);
      //     model.rotation.set(0,-Math.PI/2,0);
      //     const animation  = gltf.animations[0];
      //     const mixer = new THREE.AnimationMixer( model );
      //     this.mixers.push( mixer );
      //     const action = mixer.clipAction( animation );
      //     action.play();
      //     this.scene.add( model );
      // },()=>{},(event)=>{console.log(event.message)});

      // loader.load('http://69.254.195.147:8000/Horse.glb',
      // ( gltf )=>{
      //     const model = gltf.scene.children[0];
      //     model.position.set(40,0,-8);
      //     model.scale.setScalar(0.1);
      //     model.rotation.set(0,-Math.PI/2,0);
      //     const animation  = gltf.animations[0];
      //     const mixer = new THREE.AnimationMixer( model );
      //     this.mixers.push( mixer );
      //     const action = mixer.clipAction( animation );
      //     action.play();
      //     this.scene.add( model );
      // },()=>{},(event)=>{console.log(event.message)});

      // loader.load('http://69.254.195.147:8000/Tree_2.glb',
      // ( gltf )=>{
      //     gltf.scene.position.set(-50,-5,-30);
      //     gltf.scene.scale.setScalar(6);
      //     gltf.scene.rotation.set(0,Math.PI/2,0);
      //     this.scene.add(gltf.scene);
      // },()=>{},(event)=>{console.log(event.message)});

      

        this.scene.add(redLight);
        this.scene.add(whiteLight);
    }

    public tick( command:COMMAND.Command<any>){     
        // CommonUpdate


        // Server specific / Client specific updates.        
        if(this.clientId==="SERVER"){
            this.updateServerModel();
        }else{
            this.updateClientModel(command);
        }
    }

    //TODO: 
    private updateCommonModel(command:COMMAND.Command<any>){

    }

    //TODO:
    private updateClientModel(command:COMMAND.Command<any>){
        // if ( this.currentPiece!==null ) {   
        // if(this.gameState.movPlayerDown ===true){
        //     //this.forceDown(network
        //     let newCommand = new COMMAND.Command(this.clientId,'movement',new THREE.Vector3(0,-1,0));
        //     controlManager.addCommand(newCommand);
        //     this.gameState.movPlayerDown=false;
        // }else{
        //     controlManager.processCommand();
        // }
        // }
        // if(this.gameState.waitingForNewPiece){
        // return;
        // }
        // this.syncGame();
    }

    //TODO:
    private updateServerModel(){

    }


    //TODO: Decouple.
    public updateNetworkInfo(info: T.NetworkInfo){
        // if(info.serverTime!==undefined){
        //     this.gameTimeVariables.syncTime = info.serverTime;
        // }
        // if(info.clientId!==undefined){
        //     this.network.clientId = info.clientId;
        //     this.clientId = info.clientId;
        // }
        // if(info.persistentBlocks!==undefined)
        //     this.network.persistentBlocks = info.persistentBlocks;
        // if(info.serverTime!==undefined)
        //     this.network.serverTime = info.serverTime;
        // if(info.users!==undefined){
        //     this.network.users = info.users;
        // }
        // this.gameState.waitingForUpdate = false;
    }



    //TODO: Decouple
    private syncGame(){
        //modifies positions so they are current with the network

      
      // this.handleLocalPlayer();
      // this.handleNetworkedPlayers();
      // this.handlePersistantPieces();

    }


    //Tetris
    public getBlockPositions(){
      
        //TODO: Refactor, remove all association with current piece.
        const info:any = {};
        // info['color'] = this.currentPiece.color;
        // info['blocks'] = EXT.getRotatedBlocksFromMesh(this.currentPiece.mesh);
        // info['blocks'] = EXT.bakeInOrigin(info['blocks'], this.currentPiece.mesh.position);
        
        return info;
        //this.currentPiece = null;
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

    //TODO: Decouple
    // private handleNetworkedPlayers(){    
    //   let networkUserMap = new Map(this.network.users.map(i=>[i.id,i]));
    //   let localPieceMap = new Map(this.scene.children.map(i=>[i.userData.owner,i]));
    //   //console.log(localPieceMap);
    //   this.networkedPieces.forEach(piece=>{
    //     if(networkUserMap.get(piece.mesh.userData.owner)!==undefined){
    //       piece.syncPiece(networkUserMap.get(piece.mesh.userData.owner))
    //     }
    //   });
    //   this.network.users.forEach(usr=>{
    //     if(usr.id!==this.clientId){
    //       let index = EXT.getObjectByUserData(this.scene,'owner',usr.id);
    //       if(index===undefined){
    //         //add any users that are in networkUserMap but not in the local scene
    //         let userNetworkInfo = networkUserMap.get(usr.id);
    //         let rot  = userNetworkInfo.rotation;
    //         let pos = userNetworkInfo.position;
    //         let pt = userNetworkInfo.pieceType;
    //         let userData = <T.UserData>{};
    //         userData.entityType = "playerPiece"
    //         userData.owner = usr.id;
    //         userData.pieceType = pt; 
    //         let pm = PC.PIECE_MAP;
    //         let bpm = PC.BLOCK_POSITIONS;
    //         let pcm = PC.PIECE_COLOR_MAP;
    //         //
    //         let bp = bpm.get(pm.get(pt));
    //         new PIECE.NetworkPlayerPiece(this.scene,bp,pcm.get(pt),pos,rot,userData)
    //         //this.networkedPieces.push();
    //         console.log("NETWORK_PLAYER_CREATE: " + pm.get(pt));
    //       }else{
    //       //else update those users
    //       //need to change the model if its not the same
    //         let currentLocalPiece = localPieceMap.get(usr.id);
    //         let netUserPiece = networkUserMap.get(usr.id);
    //         let pm = PC.PIECE_MAP;
    //         // console.log("Local NetworkedPiece");
    //         // console.log(pm.get(currentLocalPiece.userData.pieceType));
    //         // console.log("NetworkedPiece on the network");
    //         // console.log(pm.get(netUserPiece.pieceType));
    //         currentLocalPiece.position.set(usr.position.x,usr.position.y,usr.position.z); 
    //         currentLocalPiece.rotation.set(usr.rotation.x,usr.rotation.y,usr.rotation.z);
    //       }
    //     }
    //   })
    //   //remove any users that are local but not in the network.users
    //   this.scene.children.forEach(child=>{
    //     if(child.userData.entityType === 'playerPiece'){  
    //       if(!networkUserMap.has(child.userData.owner)){
    //         this.scene.remove(child);
    //       }
    //     }
    //   })
    // }

    //TODO: Decouple
    // private handlePersistantPieces(){
    //   //removes anything local thats not in the server
    //   // this.scene.children.forEach(child=>{
    //   //   if(child.userData.entityType === 'persistentBlock'){  
    //   //     if(!networkUserMap.has(child.userData.owner)){
    //   //       this.scene.remove(child);
    //   //     }
    //   //   }
    //   // })
    //   let networkUserMap = new Map(this.network.users.map(i=>[i.id,i]));
    //   //let localPieceMap = new Map(this.scene.children.map(i=>[i.userData.owner,i]));
    //   let persistentBlocks = this.network.persistentBlocks;   
    //   //Make sure everything on the server is in thed local scene
    //   let localPersistentBlocks = this.scene.children.filter((child)=>{
    //     return child.userData.pieceType===1337;
    //   });
    //   let LPBMap = new Map(localPersistentBlocks.map(i=>[i.userData.owner,i]));
    //   let NPBMap = new Map(this.network.persistentBlocks.map(i=>[i.uuid,i]));
    //   persistentBlocks.forEach((block)=>{
    //     if(!LPBMap.has(block.uuid)){
    //       let userData = <T.UserData>{};
    //       userData.entityType = "persistentBlock"
    //       userData.owner = block.uuid;
    //       userData.pieceType = 1337;
    //       BLOCK.createBlock(this.scene,userData,block.color,block.position);
    //     }          
    //   });
    //   localPersistentBlocks.forEach(block=>{
    //     if(!NPBMap.has(block.userData.owner)){
    //       this.scene.remove(block);
    //     }else{
    //       block.position.set(
    //         NPBMap.get(block.userData.owner).position.x,
    //         NPBMap.get(block.userData.owner).position.y,
    //         NPBMap.get(block.userData.owner).position.z);
    //     }
    //   })
    // }

    public processCommand( command:any ){
        //TODO: Refactor, remove all association with current piece.
        //this.currentPiece;
    }

}