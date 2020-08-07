
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



interface GameState{
    movPlayerDown:boolean;
    waitingForUpdate:boolean;
    resetGame:boolean;
    waitingForNewPiece: boolean;
}
  
interface GameTimeVariables{
    secondsPerTick:number,
    syncTime: number, // the time we get from the server, and is updated every call to UPDATE
    previousTime: number, //the time we use to determine whether we have passed a secondsPerTick threshhold value
    secondsSinceLastUpdate:number
}

export class Game {
    
    // public network: T.NetworkInfo;
    scene: THREE.Scene;

    //animations
    mixers: THREE.AnimationMixer[];
    clock: THREE.Clock;

    gameState: GameState;
    gameTimeVariables: GameTimeVariables;
    clientId: string;

    constructor(){
        //animations
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        //this.network = <T.NetworkInfo>{};

        this.gameState = <GameState>{};
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

        this.init();

    }

    public setClientId( clientId:string ){
        this.clientId = clientId;
    }

    //TODO: 
    public setPlayerPiece(  ){

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

  //TODO: Decouple.
  // public update(controlManager:CM.ControlManager){     
  //   if ( this.currentPiece!==null ) {   
  //     if(this.gameState.movPlayerDown ===true){
  //         //this.forceDown(network
  //         let newCommand = new COMMAND.Command(this.clientId,'movement',new THREE.Vector3(0,-1,0));
  //         controlManager.addCommand(newCommand);
  //         this.gameState.movPlayerDown=false;
  //     }else{
  //         controlManager.processCommand();
  //     }
  //   }
  //   if(this.gameState.waitingForNewPiece){
  //     return;
  //   }
  //   this.syncGame();
  // }

  //TODO: Decouple.
  //   public updateNetworkInfo(info: T.NetworkInfo){
  //     if(info.serverTime!==undefined){
  //       this.gameTimeVariables.syncTime = info.serverTime;
  //     }
  //     if(info.clientId!==undefined){
  //       this.network.clientId = info.clientId;
  //       this.clientId = info.clientId;
  //     }
  //     if(info.persistentBlocks!==undefined)
  //       this.network.persistentBlocks = info.persistentBlocks;
  //     if(info.serverTime!==undefined)
  //       this.network.serverTime = info.serverTime;
  //     if(info.users!==undefined){
  //       this.network.users = info.users;
  //     }
  //     this.gameState.waitingForUpdate = false;
  // }

    //modifies positions so they are current with the network
    private syncGame(){

      //TODO: Decouple
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
    // private handleLocalPlayer(){
    //   let networkUserMap = new Map(this.network.users.map(i=>[i.id,i]));
    //   let currentUserNetworkInfo = networkUserMap.get(this.clientId);
    //   if( this.currentPiece===null ){
    //       // Remove any local meshes that is still in our scene.
    //       this.scene.children
    //       .filter((child)=> {return child.userData.owner===this.clientId})
    //       .forEach((piece)=>{this.scene.remove(piece)});
    //       // Create the new piece.
    //       networkUserMap = new Map(this.network.users.map(i=>[i.id,i]));
    //       currentUserNetworkInfo = networkUserMap.get(this.clientId);
    //       this.currentPiece = new PIECE.LocalPlayerPiece(this.scene, currentUserNetworkInfo);    
    //   }
    // }

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