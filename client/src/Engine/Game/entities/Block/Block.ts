import * as THREE from 'three';
import * as T from '../../../Util/types';

// export class Block {
//     constructor(scene:THREE.Scene, userData:T.UserData, pColor:number, position:THREE.Vector3){
//         const geometry = new THREE.BoxGeometry(1,1,1);
//         const material = new THREE.MeshBasicMaterial( {color: pColor} );
//         const mesh = new THREE.Mesh(geometry,material);
//         mesh.userData = userData;
//         mesh.position.add(position);
//     }
// }

export const createBlock = (scene:THREE.Scene, 
    userData:T.UserData, 
    pColor:number, 
    position:THREE.Vector3) => {
    
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial( {color: pColor} );
    const mesh = new THREE.Mesh(geometry,material);
    mesh.userData = userData;
    mesh.position.add(position);
    mesh.name = mesh.userData.owner;
    scene.add(mesh);

}