import * as THREE from 'three';

export const getObjectByUserData = 
( scene:THREE.Scene, key:string, value:string ):THREE.Object3D => {
    let func = "child.userData."+key;
    const index = scene.children.findIndex((child)=>{
        //console.log(eval(func));
        return eval(func) === value;
    });
    if(index===-1){
        return undefined;
    }
    else{
        return scene.children[index];
    }
}
