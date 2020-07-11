import {BoxGeometry, MeshBasicMaterial, Mesh, Raycaster} from "three";
import * as THREE from 'three';
import{Vector3} from 'three';

class Piece{

    constructor(pBlockPositions, pColor, pPos, pRaycasters){
        //class variables
        this.color = pColor;
        this.blockPositions = pBlockPositions; 
        this.raycasters = pRaycasters;
        this.startingPosition = pPos;

        this.initClassVariables();
        this.initCollisionVariables();
        this.initRaycasters();

    }

    //initialization
    initClassVariables(){
        this.mesh = new THREE.Object3D();
        this.mesh.name = "cube";

        //create the blocks
        for(let i = 0;i< this.blockPositions.length;i++){
            let geometry = new BoxGeometry(1,1,1);
            let material = new MeshBasicMaterial( { color: this.color } );
            this.mesh.add(new Mesh(geometry,material));
        }

        //put the blocks where it needs to go
        for(let i = 0;i< this.blockPositions.length;i++){
            this.mesh.children[i].position.add(this.blockPositions[i]);
        }
        
        //move the group object to its starting position
        this.mesh.position.add(this.startingPosition);
    }

    initCollisionVariables(){
        this.collision_isBlocked = {};
        this.collision_isBlocked['up'] = false;
        this.collision_isBlocked['down'] = false;
        this.collision_isBlocked['left'] = false;
        this.collision_isBlocked['right'] = false;
        this.collision_isBlocked['in'] = false;
        this.collision_isBlocked['out'] = false;
        this.collision_isBlocked['cw'] = false;
        this.collision_isBlocked['ccw'] = false;
    }

    initRaycasters(){
 
        //TODO

    }

    //mutators
    setPosition(newPos){
    }

    instantDrop(){
        while(!this.collision_isBlocked['down']){
            this.move(new Vector3(0,-1,0));
            this.initRaycasters();
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

    moveIn(){
        this.move(new Vector3(0,0,-1));
    }

    moveOut(){
        this.move(new Vector3(0,0,1));
    }

    move(mov){
        this.mesh.position.add(mov);
    }

    rotate(angle) {
        this.mesh.rotation.z += angle;
        console.log(this.mesh);
    };

    update(){
        this.checkAllCollisions();
        //checkAllCollisions();
    }
    
    //collisions
    checkAllCollisions(){
        this.initRaycasters();

        this.checkCollisionUp();
        this.checkCollisionDown();
        this.checkCollisionLeft();
        this.checkCollisionRight();
    }

    checkCollisionUp(){
    
    }

    checkCollisionDown(){
 
    }

    checkCollisionLeft(){
 
    }

    checkCollisionRight(){
 
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
                
            let upCollisionChecks = [0,1,2];
            let downCollisionChecks = [1,2,3];
            let leftCollisionChecks = [1,3];
            let rightCollisionChecks = [2,3];
    
            let collisionChecks = {
                'up' : upCollisionChecks,
                'down' : downCollisionChecks,
                'left' : leftCollisionChecks,
                'right': rightCollisionChecks
            };
    
            retPiece = new Piece(blocks,T_color, new Vector3(0,18,0), collisionChecks);
            break;
        }
        case 1://S
        {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(0,1,0),
                new Vector3(1,1,0)];

            let upCollisionChecks = [2,3,1];
            let downCollisionChecks = [0,1,3];
            let leftCollisionChecks = [1,2];
            let rightCollisionChecks = [0,3];
    
            let collisionChecks = {
                'up' : upCollisionChecks,
                'down' : downCollisionChecks,
                'left' : leftCollisionChecks,
                'right': rightCollisionChecks
            };
            retPiece = new Piece(blocks,S_color, new Vector3(0,18,0), collisionChecks);
            break;
        }
        case 2://I
        {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(1,0,0),
                new Vector3(2,0,0)];

            let raycasters = [];

            blocks.forEach((block)=>{
                raycasters.push(new Raycaster(block, new Vector3(-1,0,0),0,1));
                raycasters.push(new Raycaster(block, new Vector3(1,0,0),0,1));
                raycasters.push(new Raycaster(block, new Vector3(0,-1,0),0,1));
                raycasters.push(new Raycaster(block, new Vector3(0,1,0),0,1));
                raycasters.push(new Raycaster(block, new Vector3(0,0,-1),0,1));
                raycasters.push(new Raycaster(block, new Vector3(0,0,1),0,1));
            })
     
            retPiece = new Piece(blocks,I_color, new Vector3(0,18,0), raycasters);
            break;
        }
        case 3://L
        {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(1,0,0),
                new Vector3(-1,0,0),
                new Vector3(-1,-1,0)];
            
            let upCollisionChecks = [0,1,2];
            let downCollisionChecks = [3,0,1];
            let leftCollisionChecks = [2,3];
            let rightCollisionChecks = [1,3];
    
            let collisionChecks = {
                'up' : upCollisionChecks,
                'down' : downCollisionChecks,
                'left' : leftCollisionChecks,
                'right': rightCollisionChecks
            };
    
            retPiece = new Piece(blocks,L_color, new Vector3(0,18,0), collisionChecks);
            break;
        }
        case 4://J
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(1,0,0),
                new Vector3(1,-1,0)]; 
            
            let upCollisionChecks = [0,1,2];
            let downCollisionChecks = [0,1,3];
            let leftCollisionChecks = [1,3];
            let rightCollisionChecks = [2,3];

            let collisionChecks = {
                'up' : upCollisionChecks,
                'down' : downCollisionChecks,
                'left' : leftCollisionChecks,
                'right': rightCollisionChecks
            };

            retPiece = new Piece(blocks,J_color, new Vector3(0,18,0), collisionChecks);
            break;
        }
        case 5://Z
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(0,-1,0),
                new Vector3(1,-1,0)];

            let upCollisionChecks = [0,1,3];
            let downCollisionChecks = [1,2,3];
            let leftCollisionChecks = [1,2];
            let rightCollisionChecks = [0,3];

            let collisionChecks = {
                'up' : upCollisionChecks,
                'down' : downCollisionChecks,
                'left' : leftCollisionChecks,
                'right': rightCollisionChecks
            };

            retPiece = new Piece(blocks,Z_color, new Vector3(0,18,0), collisionChecks);
            break;
        }
        case 6://O
            {
            let blocks = [
                new Vector3(0,0,0),//top left
                new Vector3(1,0,0),//top right
                new Vector3(1,-1,0),//bot right
                new Vector3(0,-1,0)];//bot left

            let upCollisionChecks = [0,1];
            let downCollisionChecks = [2,3];
            let leftCollisionChecks = [0,3];
            let rightCollisionChecks = [1,2];

            let collisionChecks = {
                'up' : upCollisionChecks,
                'down' : downCollisionChecks,
                'left' : leftCollisionChecks,
                'right': rightCollisionChecks
            };

            retPiece = new Piece(blocks,O_color, new Vector3(0,18,0), collisionChecks);
            break;
        }
        default ://single cube
        {
            let blocks =[
                new Vector3(0,0,0)
            ]
            
            let upCollisionChecks = [0];
            let downCollisionChecks = [0];
            let leftCollisionChecks = [0];
            let rightCollisionChecks = [0];

            let collisionChecks = {
                'up' : upCollisionChecks,
                'down' : downCollisionChecks,
                'left' : leftCollisionChecks,
                'right': rightCollisionChecks
            };

            retPiece = new Piece(blocks,0xffffff, new Vector3(0,18,0), collisionChecks);
            break;
        }
    }
    
    return retPiece;
}

export default createPiece;
