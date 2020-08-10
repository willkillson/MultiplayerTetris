// @ts-ignore
import * as THREE from 'three';
import * as T from '../../../common-utilities/types'
import * as C from '../../entities/Piece/PieceConstants';


export const createBlock = (scene:THREE.Scene, userData:T.UserData, position:THREE.Vector3) => {

    let pcm = C.PIECE_COLOR_MAP;
                // @ts-ignore
    let pColor = pcm.get(userData.clientInfo.pieceType);
    
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshLambertMaterial( {color: pColor} );
    const mesh = new THREE.Mesh(geometry,material);
    mesh.userData = userData;
    mesh.position.add(position);
    mesh.name = mesh.userData.owner;
    scene.add(mesh);

}