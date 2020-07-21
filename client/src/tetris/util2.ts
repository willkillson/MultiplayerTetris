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

const removeAllListANotInGraphB = ( list:any, graph:any ) => {
    
}

interface Vec3{
    x: number,
    y: number,
    z: number
}

interface Block{
    player: string,//the player who created this block
    color: string,
    position: Vec3,
    piece_type: number,
    uuid: string//unique identifier assigned by the server
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