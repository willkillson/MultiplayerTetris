
//NodeImports
import * as THREE from 'three';

//LocalImports
import * as PC from './entities/Piece/PieceConstants'
import * as PIECE from './entities/Piece/Piece';

import * as BOARD from './entities/Board/board'
import * as CM from '../Controls/ControlManager'
import * as NETWORK from '../Network/ClientNetwork'
import * as T from '../Util/types'
import * as EXT from '../Util/ThreeExtension'
import * as BLOCK from './entities/Block/Block'
import * as COMMAND from '../Controls/Command';

interface GameState{
    movPlayerDown
}
  
interface GameTimeVariables{
    secondsPerTick:number,
    syncTime: number, // the time we get from the server, and is updated every call to UPDATE
    previousTime: number, //the time we use to determine whether we have passed a secondsPerTick threshhold value
    secondsSinceLastUpdate:number
}

export class Game {
    
    public network: T.NetworkInfo;
    scene: THREE.Scene;

    //Tetris
    currentPiece: PIECE.LocalPlayerPiece;
    networkedPieces: PIECE.NetworkPlayerPiece[];

    gameState: GameState;
    gameTimeVariables: GameTimeVariables;
    clientId: string;

    constructor(){

        this.scene = new THREE.Scene();
        this.network = <T.NetworkInfo>{};

        this.gameState = {
            //when true, the game will force the player to move down
            movPlayerDown:false
        }
        // default game values
        this.currentPiece = null;
        this.networkedPieces = [];
        //gameTime
        this.gameTimeVariables = {
            secondsPerTick: 2,
            syncTime: 0,
            previousTime: 0,
            secondsSinceLastUpdate: 0
        }

        this.init();

    }

    public setClientId( clientId:string ){
        this.clientId = clientId;
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

        this.scene.add(redLight);
        this.scene.add(whiteLight);
    }

    public update(controlManager:CM.ControlManager){

      //syncs all network information with the game information
      //public network: T.NetworkInfo
      //console.log(this.gameTimeVariables);
      //console.log(this);

      this.syncGame();
      if (this.currentPiece!==null) {
        if(this.gameState.movPlayerDown ===true){
            //this.forceDown(network
            let newCommand = new COMMAND.Command(this.clientId,'movement',new THREE.Vector3(0,-1,0));
            controlManager.addCommand(newCommand);
            this.gameState.movPlayerDown=false;
        }else{
            controlManager.processCommand();
        }
      }

      //changes the game state based on the number of ticks.
      if(this.gameTimeVariables.syncTime%this.gameTimeVariables.secondsPerTick===0){
          this.gameTimeVariables.secondsSinceLastUpdate = this.gameTimeVariables.syncTime - this.gameTimeVariables.previousTime;
          if(this.gameTimeVariables.secondsSinceLastUpdate!==0){
              this.gameTimeVariables.previousTime = this.gameTimeVariables.syncTime;//update the previous time we did this
              this.gameState.movPlayerDown=true;
          }
      }

    }

    public updateNetworkInfo(info: T.NetworkInfo){
        // console.log("updateNetworkInfo(info: T.NetworkInfo)");
        // console.log(info);
        
        if(info.serverTime!==undefined){
          this.gameTimeVariables.syncTime = info.serverTime;
        }
        if(info.clientId!==undefined){
          this.network.clientId = info.clientId;
          this.clientId = info.clientId;
        }
        if(info.persistentBlocks!==undefined)
          this.network.persistentBlocks = info.persistentBlocks;
        if(info.serverTime!==undefined)
          this.network.serverTime = info.serverTime;
        if(info.users!==undefined)
          this.network.users = info.users;
    }

    //Tetris
    public getBlockPositions(){
        const info = {};
        info['color'] = this.currentPiece.color;
        info['blocks'] = EXT.getRotatedBlocksFromMesh(this.currentPiece.mesh);
        info['blocks'] = EXT.bakeInOrigin(info['blocks'], this.currentPiece.mesh.position);
        
        return info;
        //this.currentPiece = null;
    }

    //Tetris
    resetGame(){

        // let inActivePieces = this.scene.children.filter((child)=>{
        //   return child.userData.entityType==='inactive_piece';
        // });
        // //console.log(inActivePieces);
        // inActivePieces.forEach((piece)=>{
        //   this.scene.remove(piece);
        // })

    }

    //modifies positions so they are current with the network
    private syncGame(){
      const networkUserMap = new Map(this.network.users.map(i=>[i.id,i]));
      const localPieceMap = new Map(this.scene.children.map(i=>[i.userData.owner,i]));

      this.handleLocalPlayer( networkUserMap,localPieceMap );

      console.log(networkUserMap);
      //this.handleNetworkedPlayers( networkUserMap,localPieceMap );
      //this.handlePersistantPieces( networkUserMap,localPieceMap );
      //console.log(this.currentPiece.blocks);
 
    }

    private handleLocalPlayer( networkUserMap,localPieceMap ){
      if(this.currentPiece===null){
        //TODO: this could be refactored into its own code once the 
        //piece is assigned null on 'set'
        //remove any local piece that is still in our scene.
        this.scene.children
        .filter((child)=> {return child.userData.owner===this.clientId})
        .forEach((piece)=>{this.scene.remove(piece)});

        let currentUserNetworkInfo = networkUserMap.get(this.clientId);
        let rot  = currentUserNetworkInfo.rotation;
        let pos = currentUserNetworkInfo.position;
        let pt = currentUserNetworkInfo.pieceType;

        let userData = <T.UserData>{};
        userData.entityType = "playerPiece"
        userData.owner = this.clientId;
        userData.pieceType = pt;

        let pm = PC.PIECE_MAP;
        let bpm = PC.BLOCK_POSITIONS;
        let pcm = PC.PIECE_COLOR_MAP;
        console.log("LOCAL_PLAYER_CREATE: " + pm.get(pt));
        //
        let bp = bpm.get(pm.get(pt));
        this.currentPiece = new PIECE.LocalPlayerPiece(this.scene,bp,pcm.get(pt),pos,rot,userData);

      }else{
              //else update those users
        //need to change the model if its not the same
        let currentLocalPiece = localPieceMap.get(this.clientId);
        let netUserPiece = networkUserMap.get(this.clientId);
        let pm = PC.PIECE_MAP;
        console.log("LocalPeice");
        console.log(pm.get(currentLocalPiece.userData.pieceType));
        console.log("LocalPeice on the Network");
        console.log(pm.get(netUserPiece.pieceType));

        let cuni = networkUserMap.get(this.clientId);
        this.currentPiece.mesh.position.set(cuni.position.x,cuni.position.y,cuni.position.z); 
        this.currentPiece.mesh.rotation.set(cuni.rotation.x,cuni.rotation.y,cuni.rotation.z);
      }
    }

    private handleNetworkedPlayers(networkUserMap, localPieceMap){    

      // this.networkedPieces.forEach(piece=>{
      //   if(networkUserMap.get(piece.mesh.userData.owner)!==undefined){
      //     piece.syncPiece(networkUserMap.get(piece.mesh.userData.owner))
      //   }
      // });
      this.network.users.forEach(usr=>{
        if(usr.id!==this.clientId){
          let index = EXT.getObjectByUserData(this.scene,'owner',usr.id);
          if(index===undefined){
            //add any users that are in networkUserMap but not in the local scene
            let userNetworkInfo = networkUserMap.get(usr.id);
            let rot  = userNetworkInfo.rotation;
            let pos = userNetworkInfo.position;
            let pt = userNetworkInfo.pieceType;
            let userData = <T.UserData>{};
            userData.entityType = "playerPiece"
            userData.owner = usr.id;
            userData.pieceType = pt; 
            let pm = PC.PIECE_MAP;
            let bpm = PC.BLOCK_POSITIONS;
            let pcm = PC.PIECE_COLOR_MAP;
            //
            let bp = bpm.get(pm.get(pt));
            this.networkedPieces.push(new PIECE.NetworkPlayerPiece(this.scene,bp,pcm.get(pt),pos,rot,userData));
            console.log("NETWORK_PLAYER_CREATE: " + pm.get(pt));
          }else{
          //else update those users
          //need to change the model if its not the same
            let currentLocalPiece = localPieceMap.get(usr.id);
            let netUserPiece = networkUserMap.get(usr.id);
            let pm = PC.PIECE_MAP;
            
            console.log("Local NetworkedPiece");
            console.log(pm.get(currentLocalPiece.userData.pieceType));
            console.log("NetworkedPiece on the network");
            console.log(pm.get(netUserPiece.pieceType));



            
            
            currentLocalPiece.position.set(usr.position.x,usr.position.y,usr.position.z); 
            currentLocalPiece.rotation.set(usr.rotation.x,usr.rotation.y,usr.rotation.z);
          }
        }
      })
      //remove any users that are local but not in the network.users
      this.scene.children.forEach(child=>{
        if(child.userData.entityType === 'playerPiece'){  
          if(!networkUserMap.has(child.userData.owner)){
            this.scene.remove(child);
          }
        }
      })

    }

    private handlePersistantPieces( networkPieceMap,localPieceMap ){
      let persistentBlocks = this.network.persistentBlocks;        
      //Make sure everything on the server is in thed local scene
      
      persistentBlocks.forEach((block)=>{
        if(!localPieceMap.has(block.uuid)){
          console.log(persistentBlocks);
          console.log("Creating block");
          console.log(localPieceMap);
          console.log(block.uuid);
          //create the block in the scene
          let userData = <T.UserData>{};
          userData.entityType = "persistentBlock"
          userData.owner = block.uuid;
          userData.pieceType = 1337;
          BLOCK.createBlock(this.scene,userData,block.color,block.position);
        }          
      });
      //removes anything local thats not in the server
      this.scene.children.forEach(child=>{
        if(child.userData.entityType === 'persistentBlock'){  
          if(!networkPieceMap.has(child.userData.owner)){
            this.scene.remove(child);
          }
        }
      })
    }

    public validateCommand( command:COMMAND.Command<any> ): boolean{
      this.currentPiece.update();

      if(command.cmdValue.x===-1){
        return !this.currentPiece.collision_isBlocked.left;
      }
      if(command.cmdValue.x===1){
        return !this.currentPiece.collision_isBlocked.right;
      }
      if(command.cmdValue.y===-1){
        return !this.currentPiece.collision_isBlocked.down;
      }
      return true;
    }

}