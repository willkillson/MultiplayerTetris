import Tetris from './Tetris'
import Piece from './pieces/piece'
import { Vector3 } from 'three'

interface Player{
    position_x:number,
    position_y:number,
    position_z:number,
    rotation: Vec3,
    piece_type: number
}

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
    let client = newClient.users.find(client=>client.id===newClient.id);
    //process error handling for client
    if(client!==undefined){
        if(client.position!==undefined && client.rotation!==undefined && client.pieceType!==null && client.pieceType!==undefined &&client.id){
            //all is good, instantiate player piece
            initPlayerPiece(client,game);
            //process error handling for other clients
            let otherClientInformation = newClient.users.map(usr=>{
                if(client!==undefined)
                    if(usr.id!==client.id)
                        return  usr;
            });
            initOtherPlayersPieces(otherClientInformation,game);
        }
        else{
            throw new Error("Client attributes are not assigned.");        
        }
    }else{
        throw new Error("Client is not registered on the server.");        
    }
}

const initPlayerPiece = (client:Client, game:Tetris) => {
    //create the users piece
    let id  = client.id;
    let pieceType:any = client.pieceType;
    let position = client.position;
    let rotation = client.rotation;

    let threeVec3:Vector3 = new Vector3(position.x,
        position.y,
        position.z);

    game.currentPiece = Piece(pieceType,threeVec3);
    game.scene.add(game.currentPiece.mesh);
}

const initOtherPlayersPieces = (clients:(Client|undefined)[], game:Tetris) =>{
    
}

const initNonPlayerPieces = (blocks:Block[], game:Tetris) => {
    //TODO

}

export const onUpdate = (info:any, game:Tetris) =>{

    console.log(info);

        // removes all units that don't exist anymore.
     
      //NETWORK.syncronizeScene(this, info);

      //NETWORK.handleOtherPlayersPieces(this, info);

      //NETWORK.handlePlayersPiece(this, info);

      //NETWORK2.handleNonPlayerPieces(this,info);
      
}

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

            let newPiece: any = Piece(csb.piece_type,position);
            newPiece.mesh.name = csb.uuid;
            game.scene.add(newPiece.mesh);
        })
    }

}