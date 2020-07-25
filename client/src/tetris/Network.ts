import Tetris from './Tetris'
import createPiece from './pieces/piece'
import Piece from './pieces/piece'
import { Vector3 } from 'three'

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
    users: Client[]
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
    let clientIndex = newClient.users.findIndex((usr)=>{
        if(usr!==null){
            return usr.id===game.clientId;
        }
    });

    const client =  newClient.users.splice(clientIndex,1);
    game.clientId  = client[0].id;

    //process error handling for other clients

    console.log(newClient.users);
    

    initOtherPlayersPieces(newClient.users,game);
    
    
}

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

const initNonPlayerPieces = (blocks:Block[], game:Tetris) => {

    console.log(blocks);
    //TODO

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
    users:Client[]
}

export const onUpdate = (info:any, game:Tetris) =>{

    let jsonInfo:updateInfo = JSON.parse(info);
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
        console.log(game.currentPiece);
        game.scene.add(game.currentPiece.mesh);

    } else {
      // set the position
      // console.log(ourNetworkedCurrentPiece);
      if(playerInfo.pieceType!==null){
        game.currentPiece.mesh.position.x = playerInfo.position.x;
        game.currentPiece.mesh.position.y = playerInfo.position.y;
        game.currentPiece.mesh.position.z = playerInfo.position.z;
    
        // set the rotation
        // console.log(ourNetworkedCurrentPiece);
        game.currentPiece.mesh.rotation.x = playerInfo.rotation.x;
        game.currentPiece.mesh.rotation.y = playerInfo.rotation.y;
        game.currentPiece.mesh.rotation.z = playerInfo.rotation.z;
        // console.log(props.currentPiece.mesh.rotation);
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