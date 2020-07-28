import Tetris from './Tetris';
import * as PIECE from './Entities/piece';
import { Vector3 } from 'three'

import * as THREE from 'three'

interface Vec3{
    x: number,
    y: number,
    z: number
}

interface ClientInfo{
    id: string,
    users: Client[],
    serverTime:number
}

interface UserData{
    entityType : string,
    owner : string
}

interface Client{
    id: string,
    position: Vec3,
    rotation: Vec3,
    pieceType: number | null
}

interface Block{
    position: Vector3,
    color: number,
    uuid: string
}

/**
 * runs, 
 *      initPlayerPiece
 *      initOtherPlayersPieces
 *      initNonPlayerPieces
 *  j  
 * @param newClient 
 * @param game 
 */
export const onConnected = (newClient:ClientInfo, game:Tetris) =>{


    game.clientId = newClient.id;
    game.gameTimeVariables.syncTime = newClient.serverTime;
    game.gameTimeVariables.previousTime = newClient.serverTime;

}

export const updateAllPlayers = (clients:Client[], game:Tetris) => {

//Gater all the active pieces from the scene.
    let activePieces = game.scene.children.filter((child)=>{
        return child.userData.entityType==='active_piece';
    });

//Remove all active pieces from the scene.
    activePieces.forEach(piece=>{
        game.scene.remove(piece);
    })

//Recreate them.
    clients.forEach((clientPiece:Client)=>{

        let position = clientPiece?.position;
        let clientPieceType = clientPiece?.pieceType;
        let newVector = new Vector3(position?.x,position?.y,position?.z);

        if(clientPieceType!==null){
            
            // @ts-ignore
            let piece:any = PIECE.createPiece(clientPieceType, newVector);

            if(game.clientId===clientPiece.id){
                game.currentPiece = piece;
            }
        
            piece.mesh.userData = {
                entityType : "active_piece",
                owner : clientPiece.id
            }
    
            piece.mesh.rotation.x = clientPiece.rotation.x;
            piece.mesh.rotation.y = clientPiece.rotation.y;
            piece.mesh.rotation.z = clientPiece.rotation.z;
        
            game.scene.add(piece.mesh);

            //if the position is 0,18,0, and the piece is imediatly blcoked down, then the game has ended.
            //console.log(clientPiece.position);
            if(clientPiece.position.x===0 && clientPiece.position.y===18 && clientPiece.position.z===0){
                piece.update();
                
                if(piece.collision_isBlocked.down===true){
                    // console.log(piece.collision_isBlocked);
                    // //the game has ended
                    // console.log("clearBoard");
                    game.socket.emit('clearBoard');
                    return;
                }
            }
            
        }
        
    });
}

export const onNewPlayer = (client:any, game:Tetris) =>{

    if(game.clientId!==client.id){
        
        let position = client?.position;
        let clientPieceType = client?.pieceType;
        let newVector = new Vector3(position?.x,position?.y,position?.z);

        if(clientPieceType!==null){
            // @ts-ignore
            let piece:any = PIECE.createPiece(clientPieceType,newVector);
            piece.mesh.userData = {
                entityType : "active_piece",
                owner : client.id
            }
            game.scene.add(piece.mesh);
        }
    }
    
}

export const onPlayerDisconnect = (client:any, game:Tetris) => {
    let index = game.scene.children.findIndex(child=>child.userData.owner=== client);
    if(index!==-1){
        let dcPlayersPiece = game.scene.children[index];
        game.scene.remove(dcPlayersPiece);
    }

}

interface UpdateInfo{
    users:Client[],
    persistentBlocks:Block[],
    serverTime:number
}

export const onUpdate = (info:any, game:Tetris) =>{
    let updateInfo:UpdateInfo = JSON.parse(info);
    game.gameTimeVariables.syncTime = updateInfo.serverTime;

   // updateOtherPlayersPieces(updateInfo.users,game);

   if(updateInfo.persistentBlocks!==undefined){
       //clear the game
       game.resetGame();
   }
   updateAllPlayers(updateInfo.users,game);

}
  
const updateOtherPlayersPieces = (otherPlayersInfo:Client[], game:Tetris) =>{
    // HANDLE OTHER PLAYERS PIECE's
    otherPlayersInfo.forEach((player)=>{
        let index = game.scene.children.findIndex((child)=>child.userData.owner===player.id);
        if(index!==-1){
            game.scene.children[index].position.x = player.position.x;
            game.scene.children[index].position.y = player.position.y;
            game.scene.children[index].position.z = player.position.z;
            game.scene.children[index].rotation.x = player.rotation.x;
            game.scene.children[index].rotation.y = player.rotation.y;
            game.scene.children[index].rotation.z = player.rotation.z;
        }
    })
};

export const onPlayerSetPiece = (info:Block[], game:Tetris) => {
    info.forEach((block)=>{
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial( {color: block.color} );
        let newMesh = new THREE.Mesh(geometry,material);
        newMesh.position.x = block.position.x;
        newMesh.position.y = block.position.y;
        newMesh.position.z = block.position.z;
        newMesh.userData = {
            entityType : "inactive_piece",
            owner : block.uuid
        }
        game.scene.add(newMesh);
    })
}



//OUTGOING
interface Message{
    id:string,
    dir:string,
}

export const sendCommand = (command:string, game:Tetris) =>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = command;
    game.socket.emit('move', JSON.stringify(info));
}
