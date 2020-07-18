import * as THREE from "three";

const gizmo = () =>{
    // arrow helper
    let dir1 = new THREE.Vector3( 1, 0, 0 );
    let dir2 = new THREE.Vector3( 0, 1, 0 );
    let dir3 = new THREE.Vector3( 0, 0, 1 );

    //normalize the direction vector (convert to vector of length 1)
    dir1.normalize();
    dir2.normalize();
    dir3.normalize();
    
    let origin = new THREE.Vector3( 5, 5, 5 );
    let length = 5;

    let hex1 = 0xff0000;
    let hex2 = 0x00ff00;
    let hex3 = 0x0000ff;
    
    let arrowHelper1 = new THREE.ArrowHelper( dir1, origin, length, hex1 );
    let arrowHelper2 = new THREE.ArrowHelper( dir2, origin, length, hex2 );
    let arrowHelper3 = new THREE.ArrowHelper( dir3, origin, length, hex3 );

    let ret = [];
    ret.push(arrowHelper1);
    ret.push(arrowHelper2);
    ret.push(arrowHelper3);

    return ret;
}

export default gizmo;
