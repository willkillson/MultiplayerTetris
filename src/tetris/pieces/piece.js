import {BoxGeometry, MeshBasicMaterial, Mesh} from "three";
import * as THREE from 'three';
import{Vector3} from 'three';

class Piece{
    

    constructor(pDefaultBlockPositions, pColor, pPos){
        //class variables
        this.color = pColor;
        this.defaultBlockPositions = pDefaultBlockPositions; 
        this.position = pPos;

        this.initClassVariables();
        this.initCollisionVariables();
        this.initRaycasters();

    }

    //initialization
    initClassVariables(){
        this.mesh = new THREE.Object3D();
        this.mesh.name = "cube";
        this.defaultBlockPositions.forEach((pos)=>{
            let geometry = new BoxGeometry(1,1,1);
            let material = new MeshBasicMaterial( { color: this.color } );
            geometry.translate(
                pos.toArray()[0],
                pos.toArray()[1],
                pos.toArray()[2]);
            let mesh = new Mesh(geometry,material);
            this.mesh.add(mesh);
        });
        this.mesh.position.add(this.position);
    }

    initCollisionVariables(){
        this.collision_isBlocked = {};
        this.collision_isBlocked['up'] = false;
        this.collision_isBlocked['down'] = false;
        this.collision_isBlocked['left'] = false;
        this.collision_isBlocked['right'] = false;
        this.collision_isBlocked['cw'] = false;
        this.collision_isBlocked['ccw'] = false;
    }

    initRaycasters(){
        let near = 0;
        let far = 1;
        this.upRayCaster = new THREE.Raycaster(this.mesh.position,new Vector3(0,1,0),near,far);
        this.downRayCaster = new THREE.Raycaster(this.mesh.position,new Vector3(0,-1,0),near,far);

        this.leftRayCaster = new THREE.Raycaster(this.mesh.position,new Vector3(-1,0,0),near,far);
        this.rightRayCaster = new THREE.Raycaster(this.mesh.position,new Vector3(1,0,0),near,far);
    }

    //mutators
    setPosition(newPos){
    }

    instantDrop(){
        while(!this.collision_isBlocked['down']){
            this.move(new Vector3(0,-1,0));
            this.checkCollisionDown();
        }
    }

    moveUp(){
        if(!this.collision_isBlocked['up']){
            this.move(new Vector3(0,1,0));
        }
    }

    moveDown(){
        if(!this.collision_isBlocked['down']){
            this.move(new Vector3(0,-1,0));
        }
    }

    moveLeft(){
        if(!this.collision_isBlocked['left']){
            this.move(new Vector3(-1,0,0));
        }
    }

    moveRight(){
        if(!this.collision_isBlocked['right']){
            this.move(new Vector3(1,0,0));
        }
    }

    move(mov){
        this.mesh.position.add(mov);
    }

    rotate(angle) {
        this.mesh.rotation.add(angle);     
    };

    update(){
        this.checkAllCollisions();
        //checkAllCollisions();
    }
    
    //collisions
    checkAllCollisions(){

        this.checkCollisionUp();
        this.checkCollisionDown();
        this.checkCollisionLeft();
        this.checkCollisionRight();
    }

    checkCollisionUp(){
    
      
       let intersects = this.upRayCaster.intersectObjects(this.mesh.parent.children,true);
       if(intersects.length===0){
           this.collision_isBlocked['up'] = false;
       }
       else{
           this.collision_isBlocked['up'] = true;
       }
    }

    checkCollisionDown(){
        let intersects = this.downRayCaster.intersectObjects(this.mesh.parent.children,true);
        if(intersects.length===0){
            this.collision_isBlocked['down'] = false;
        }
        else{
            this.collision_isBlocked['down'] = true;
        }

 
    }

    checkCollisionLeft(){
        let intersects = this.leftRayCaster.intersectObjects(this.mesh.parent.children,true);
        if(intersects.length===0){
            this.collision_isBlocked['left'] = false;
        }
        else{
            this.collision_isBlocked['left'] = true;
        }
 
    }

    checkCollisionRight(){
        let intersects = this.rightRayCaster.intersectObjects(this.mesh.parent.children,true);

        if(intersects.length===0){
            this.collision_isBlocked['right'] = false;
        }
        else{
            this.collision_isBlocked['right'] = true;
        }
 
    }

}


const createPiece = (pieceType = 0) =>{

    const I_color = 0xffa500;
    const T_color = 0xadd8e6;
    const L_color = 0xfed8b1;
    const J_color = 0x0000ff;
    const S_color = 0x800080;
    const Z_color = 0x00ff00;
    const O_color = 0xffff00;

    let retPiece;

    switch(pieceType){
        case 0://T
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(1,0,0),
                    new Vector3(0,-1,0)];
                retPiece = new Piece(blocks,T_color);
                break;
            }
        case 1://S
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(0,1,0),
                    new Vector3(1,1,0)];
                retPiece = new Piece(blocks,S_color);
                break;
            }
        case 2://I
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(1,0,0),
                    new Vector3(2,0,0)];
                retPiece = new Piece(blocks,I_color);
                break;
            }
        case 3://L
            {
                let blocks = [
                    new Vector3(0,0,0),
                    new Vector3(1,0,0),
                    new Vector3(-1,0,0),
                    new Vector3(-1,-1,0)];
                retPiece = new Piece(blocks,L_color);
                break;
            }
        case 4://J
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(1,0,0),
                new Vector3(1,-1,0)];
            retPiece = new Piece(blocks,J_color);
            break;
        }
        case 5://Z
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(0,-1,0),
                new Vector3(1,-1,0)];
            retPiece = new Piece(blocks,Z_color);
            break;
        }
        case 6://O
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(1,0,0),
                new Vector3(1,-1,0),
                new Vector3(0,-1,0)];
            retPiece = new Piece(blocks,O_color);
            break;
        }
        default ://single cube
        {
                let blocks =[
                    new Vector3(0,0,0)
                ]
                retPiece = new Piece(blocks,0xffffff, new Vector3(0,18,0));
                break;
        }
    }
    
    return retPiece;
}

export default createPiece;
