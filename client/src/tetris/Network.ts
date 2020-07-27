import Tetris from './Tetris'
import createPiece from './pieces/piece'
import Piece from './pieces/piece'
import { Vector3 } from 'three'

import * as THREE from 'three'

interface Vec3{
    x: number,
    y: number,
    z: number
}

interface Block{
    player: string,//the player who created this block
    position: Vec3,
    piece_type: number,
    uuid: string//unique identifier assigned by the server
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

interface PersistentBlock{
    color: number,
    position: Vector3,
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
    console.log("export const onConnected = (newClient:ClientInfo, game:Tetris)");

    game.clientId = newClient.id;
    game.syncTime = newClient.serverTime;

    //get all the players who are not the local player
    let clientIndex = newClient.users.findIndex((usr)=>{
        if(usr!==null){
            return usr.id===game.clientId;
        }
    });
    const client =  newClient.users.splice(clientIndex,1);
    const otherClients = newClient.users;

    initOtherPlayersPieces(otherClients ,game);

}

/**
 * Initializes other players pieces. 
 * 
 * @param clients contains all the other players pieces from the server.
 * @param game the game.
 */
const initOtherPlayersPieces = (clients:(Client[]), game:Tetris) =>{

    clients.forEach((clientPiece:Client|undefined)=>{
        if(clientPiece!==undefined){
            let position = clientPiece?.position;
            let clientPieceType = clientPiece?.pieceType;
            let newVector = new Vector3(position?.x,position?.y,position?.z);

            if(clientPieceType!==null){
                let piece:any = createPiece(clientPieceType,newVector);

                piece.mesh.userData = {
                    entityType : "active_piece",
                    owner : clientPiece.id
                }
                game.scene.add(piece.mesh);
            }
        }
    });

}

export const onNewPlayer = (client:any, game:Tetris) =>{
    console.log("export const onNewPlayer = (client:any, game:Tetris)");

    if(game.clientId!==client.id){
        
        let position = client?.position;
        let clientPieceType = client?.pieceType;
        let newVector = new Vector3(position?.x,position?.y,position?.z);

        if(clientPieceType!==null){
            let piece:any = createPiece(clientPieceType,newVector);
            piece.mesh.userData = {
                entityType : "active_piece",
                owner : client.id
            }
            game.scene.add(piece.mesh);
        }
    }
    
}

export const onPlayerDisconnect = (client:any, game:Tetris) => {

    console.log("export const onPlayerDisconnect = (client:any, game:Tetris) ");
    let index = game.scene.children.findIndex(child=>child.userData.owner=== client);
    if(index!==-1){
        let dcPlayersPiece = game.scene.children[index];
        game.scene.remove(dcPlayersPiece);
    }

}

interface updateInfo{
    users:Client[],
    serverTime:number
  }

export const onUpdate = (info:any, game:Tetris) =>{
    let jsonInfo:updateInfo = JSON.parse(info);
    console.log(jsonInfo.serverTime);




    //strip out playerInfo
    const index = jsonInfo.users.findIndex((usr)=>{
        if(usr!==null)
            return usr.id===game.clientId;
    })

    let playerInfo = jsonInfo.users.splice(index,1);
    let otherPlayersInfo = jsonInfo.users;

    //console.log(playerInfo[0]);
    updatePlayerPiece(playerInfo[0], game);
    //console.log(otherPlayersInfo);
    updateOtherPlayersPieces(otherPlayersInfo, game);

}

const updatePlayerPiece = (playerInfo:Client, game:Tetris) =>{
    // HANDLE OUR CLIENTS PIECE

    if (game.currentPiece===null && playerInfo.pieceType!==null) {
        let threeVec3 = new Vector3(
            playerInfo.position.x,
            playerInfo.position.y,
            playerInfo.position.z);

        game.currentPiece = Piece(playerInfo.pieceType,threeVec3);
        game.currentPiece.mesh.name = game.clientId;
        //set the name of the piece so we can find it in the scene.
        game.currentPiece.mesh.userData = {
            entityType : "active_piece",
            owner : playerInfo.id
        }
        game.scene.add(game.currentPiece.mesh);

    } else {
      // set the position
      if(playerInfo.pieceType!==null){
        game.currentPiece.mesh.position.x = playerInfo.position.x;
        game.currentPiece.mesh.position.y = playerInfo.position.y;
        game.currentPiece.mesh.position.z = playerInfo.position.z;
    
        // set the rotation
        game.currentPiece.mesh.rotation.x = playerInfo.rotation.x;
        game.currentPiece.mesh.rotation.y = playerInfo.rotation.y;
        game.currentPiece.mesh.rotation.z = playerInfo.rotation.z;
      }
    }
};
  
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

export const handleNonPlayerPieces = (game:Tetris, networkInfo:string) =>{

    
 
    let ni = JSON.parse(networkInfo);
    let persistentBlocks:Block[] = ni['persistentblocks'];

    //grab all the blocks not in the game scene that are in the server
    let clientSide = persistentBlocks.filter((block:Block)=>{game.scene.getObjectByName(block.uuid)===undefined});

    let serverSize = persistentBlocks.length;
    let clientSize = clientSide.length

    if(clientSize<serverSize){
        //add all the pieces not in the game
        persistentBlocks.forEach((csb:Block)=>{
            let position: any = new Vector3(
                csb.position.x,
                csb.position.y,
                csb.position.z);

            let newPiece: any = createPiece(csb.piece_type,position);
            newPiece.mesh.name = csb.uuid;
            game.scene.add(newPiece.mesh);
        })
    }

}

export const onPlayerSetPiece = (info:PersistentBlock[], game:Tetris) => {
    //TODO
    console.log("export const onPlayerSetPiece = (info:any, game:Tetris)");
    console.log(info);
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
