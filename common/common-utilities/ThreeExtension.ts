
// @ts-ignore
import * as THREE from 'three';

export const getObjectByUserData = 
( scene:THREE.Scene, key:string, value:string ):THREE.Object3D => {
    let func = "child.userData."+key;
    const index = scene.children.findIndex((child)=>{
        //console.log(eval(func));
        return eval(func) === value;
    });
    if(index===-1){
                    // @ts-ignore
        return undefined;
    }
    else{
        return scene.children[index];
    }
}

export const bakeInOrigin = (blocks:THREE.Vector3[], origin:THREE.Vector3) => {
    blocks.forEach((block) => {
      block.x += origin.x;
      block.y += origin.y;
      block.z += origin.z;
    });
    return blocks;
}
  
export const calRotMatZaxis = (radians:number):THREE.Matrix4 => {
    let m = new THREE.Matrix4();
    m.set(Math.cos(radians),-Math.sin(radians),0,0,
    Math.sin(radians),Math.cos(radians),0,0,
                0,0,1,0,
                0,0,0,1);
    return m;
}
  
export const getRotatedBlocksFromMesh = (mesh:THREE.Object3D) => {
    //we rotate around the z
    let m = calRotMatZaxis(mesh.rotation.z);
    let blocks= [];
    for(let i = 0;i< mesh.children.length;i++){
        let newVec = new THREE.Vector3(
        mesh.children[i].position.x,
        mesh.children[i].position.y,
        mesh.children[i].position.z);
        newVec = newVec.applyMatrix4(m);
        newVec.x = Math.round(newVec.x*1000)/1000;
        newVec.y = Math.round(newVec.y*1000)/1000;
        newVec.z = Math.round(newVec.z*1000)/1000;
        let block = new THREE.Vector3(newVec.x,newVec.y,newVec.z);
        blocks.push(block);
    }
    return blocks;
}
