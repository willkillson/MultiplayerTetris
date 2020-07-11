import {BoxGeometry, MeshBasicMaterial, Mesh, Raycaster, Ray} from "three";
import * as THREE from 'three';
import{Vector3} from 'three';

class Piece{
    constructor(pBlockPositions, pColor, pPos){
        //class variables
        this.color = pColor;
        this.blockPositions = pBlockPositions; 
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

        //block normals for calculating each faces normal as it changes
        this.blockNormals = [];
        this.blockPositions.forEach((block)=>{
            this.blockNormals.push(new Ray(block, new Vector3(-1,0,0)));
            this.blockNormals.push(new Ray(block, new Vector3(1,0,0)));
            this.blockNormals.push(new Ray(block, new Vector3(0,-1,0)));
            this.blockNormals.push(new Ray(block, new Vector3(0,1,0)));
            this.blockNormals.push(new Ray(block, new Vector3(0,0,-1)));
            this.blockNormals.push(new Ray(block, new Vector3(0,0,1)));
        })
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

        this.x_neg_rcs = [];//collect all same facing raycasters
        this.x_pos_rcs = [];
        this.y_pos_rcs = [];
        this.y_neg_rcs = [];
        this.z_pos_rcs = [];
        this.z_neg_rcs = [];      
         
        for(let i = 0;i< this.blockNormals.length;i++){
             //apply the rotation to the raycasters direction
             let ray = this.blockNormals[i];
             let origin = ray.origin;
             let dir = ray.direction;
             
             let rotatedDirection = new Vector3(dir.x,dir.y,dir.z);
             let rotatedPosition = new Vector3(origin.x,origin.y,origin.z);

           
             
             rotatedDirection = rotatedDirection.applyQuaternion(this.mesh.quaternion);
             rotatedDirection.x = Math.round(rotatedDirection.x);
             rotatedDirection.y = Math.round(rotatedDirection.y);
             rotatedDirection.z = Math.round(rotatedDirection.z);
             rotatedPosition = rotatedPosition.applyQuaternion(this.mesh.quaternion);
             rotatedPosition.add(this.mesh.position);
 
             let rotatedRay = new Ray(rotatedPosition,rotatedDirection);
             //then check which direction it is now facing
 
             if(rotatedRay.direction.x === -1 &&
             rotatedRay.direction.y === 0 &&
             rotatedRay.direction.z === 0){
                this.x_neg_rcs.push(rotatedRay);//LEFT
             }
             if(rotatedRay.direction.x === 1 &&
                 rotatedRay.direction.y === 0 &&
                 rotatedRay.direction.z === 0){
                     this.x_pos_rcs.push(rotatedRay);//RIGHT
                 }
             if(rotatedRay.direction.x === 0 &&
                 rotatedRay.direction.y === 1 &&
                 rotatedRay.direction.z === 0){
                     this.y_pos_rcs.push(rotatedRay);//UP
                 }
             if(rotatedRay.direction.x === 0 &&
                 rotatedRay.direction.y === -1 &&
                 rotatedRay.direction.z === 0){
                     this.y_neg_rcs.push(rotatedRay);//DOWN
                 }
             if(rotatedRay.direction.x === 0 &&
                 rotatedRay.direction.y === 0 &&
                 rotatedRay.direction.z === -1){
                     this.z_pos_rcs.push(rotatedRay);//IN
                 }
             if(rotatedRay.direction.x === 0 &&
                 rotatedRay.direction.y === 0 &&
                 rotatedRay.direction.z === 1){
                     this.z_neg_rcs.push(rotatedRay);//OUT
                 }
        }        

        console.log("                        ");
        console.log("this.x_neg_rcs");
        console.log(this.x_neg_rcs);
        console.log("this.x_pos_rcs");
        console.log(this.x_pos_rcs);
        console.log("this.y_pos_rcs");
        console.log(this.y_pos_rcs);
        console.log("this.y_neg_rcs");
        console.log(this.y_neg_rcs);
        console.log("this.z_pos_rcs");
        console.log(this.z_pos_rcs);
        console.log("this.z_neg_rcs");
        console.log(this.z_neg_rcs);

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
        if(!this.collision_isBlocked['in']){
            this.move(new Vector3(0,0,-1));
        }
    }

    moveOut(){
        if(!this.collision_isBlocked['out']){
            this.move(new Vector3(0,0,1));
        }
    }


    moveOut(){
        if(!this.collision_isBlocked['out']){
            this.move(new Vector3(0,0,1));
        }
    }

    move(mov){
        this.mesh.position.add(mov);
    }

    rotateCCW() {
        if(!this.collision_isBlocked['ccw']){
            this.mesh.rotation.z += Math.PI/2;
            //this.move(new Vector3(0,0,1));
        }
    };

    rotateCW() {
        if(!this.collision_isBlocked['cw']){
            //this.move(new Vector3(0,0,1));
        }
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
        this.checkCollisionIn();
        this.checkCollisionOut();
    }

    checkCollisionUp(){
        let allIntersections = [];
        this.y_pos_rcs.forEach((ray) => {
            let rayCaster = new Raycaster(ray.origin,ray.direction,0.1,1);
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children,true));
        });
        //remove all the intersections with the pieces self
        let intersects = [];
        allIntersections.forEach((intersection)=>{
            if(intersection.object.parent.uuid!==this.mesh.uuid){
                intersects.push(intersection);
            }
        });
       if(intersects.length===0){
           this.collision_isBlocked['up'] = false;
       }
       else{
           this.collision_isBlocked['up'] = true;
       }

    
    }

    checkCollisionDown(){
        let allIntersections = [];
        this.y_neg_rcs.forEach((ray) => {
            let rayCaster = new Raycaster(ray.origin,ray.direction,0.1,1);
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children,true));
        });
        //remove all the intersections with the pieces self
        let intersects = [];
        allIntersections.forEach((intersection)=>{
            if(intersection.object.parent.uuid!==this.mesh.uuid){
                intersects.push(intersection);
            }
        });
       if(intersects.length===0){
           this.collision_isBlocked['down'] = false;
       }
       else{
           this.collision_isBlocked['down'] = true;
       }

    }

    checkCollisionLeft(){
        let allIntersections = [];
        this.x_neg_rcs.forEach((ray) => {
            let rayCaster = new Raycaster(ray.origin,ray.direction,0.1,1);
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children,true));
        });
        //remove all the intersections with the pieces self
        let intersects = [];
        allIntersections.forEach((intersection)=>{
            if(intersection.object.parent.uuid!==this.mesh.uuid){
                intersects.push(intersection);
            }
        });

       if(intersects.length===0){
           this.collision_isBlocked['left'] = false;
       }
       else{
           this.collision_isBlocked['left'] = true;
       }

    }

    checkCollisionRight(){
        let allIntersections = [];
        this.x_pos_rcs.forEach((ray) => {
            let rayCaster = new Raycaster(ray.origin,ray.direction,0.1,1);
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children,true));
        });
        //remove all the intersections with the pieces self
        let intersects = [];
        allIntersections.forEach((intersection)=>{
            if(intersection.object.parent.uuid!==this.mesh.uuid){
                intersects.push(intersection);
            }
        });

       if(intersects.length===0){
           this.collision_isBlocked['right'] = false;
       }
       else{
           this.collision_isBlocked['right'] = true;
       }

    }

    checkCollisionIn(){
        let allIntersections = [];
        this.z_pos_rcs.forEach((ray) => {
            let rayCaster = new Raycaster(ray.origin,ray.direction,0.1,1);
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children,true));
        });
        //remove all the intersections with the pieces self
        let intersects = [];
        allIntersections.forEach((intersection)=>{
            if(intersection.object.parent.uuid!==this.mesh.uuid){
                intersects.push(intersection);
            }
        });

       if(intersects.length===0){
           this.collision_isBlocked['in'] = false;
       }
       else{
           this.collision_isBlocked['in'] = true;
       }

    }

    checkCollisionOut(){
        let allIntersections = [];
        this.z_neg_rcs.forEach((ray) => {
            let rayCaster = new Raycaster(ray.origin,ray.direction,0.1,1);
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children,true));
        });
        //remove all the intersections with the pieces self
        let intersects = [];
        allIntersections.forEach((intersection)=>{
            if(intersection.object.parent.uuid!==this.mesh.uuid){
                intersects.push(intersection);
            }
        });

       if(intersects.length===0){
           this.collision_isBlocked['out'] = false;
       }
       else{
           this.collision_isBlocked['out'] = true;
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
            retPiece = new Piece(blocks,T_color, new Vector3(0,18,0));
            break;
        }
        case 1://S
        {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(0,1,0),
                new Vector3(1,1,0)];
            retPiece = new Piece(blocks,S_color, new Vector3(0,18,0));
            break;
        }
        case 2://I
        {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(1,0,0),
                new Vector3(2,0,0)];
            retPiece = new Piece(blocks,I_color, new Vector3(0,18,0));
            break;
        }
        case 3://L
        {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(1,0,0),
                new Vector3(-1,0,0),
                new Vector3(-1,-1,0)];
            retPiece = new Piece(blocks,L_color, new Vector3(0,18,0));
            break;
        }
        case 4://J
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(1,0,0),
                new Vector3(1,-1,0)]; 

            retPiece = new Piece(blocks,J_color, new Vector3(0,18,0));
            break;
        }
        case 5://Z
            {
            let blocks = [
                new Vector3(0,0,0),
                new Vector3(-1,0,0),
                new Vector3(0,-1,0),
                new Vector3(1,-1,0)];

            retPiece = new Piece(blocks,Z_color, new Vector3(0,18,0));
            break;
        }
        case 6://O
            {
            let blocks = [
                new Vector3(0,0,0),//top left
                new Vector3(1,0,0),//top right
                new Vector3(1,-1,0),//bot right
                new Vector3(0,-1,0)];//bot left
            retPiece = new Piece(blocks,O_color, new Vector3(0,18,0));
            break;
        }
        case 7://RANDOM
        {
        let blocks = [];
        blocks.push(new Vector3(0,0,-1));     
        blocks.push(new Vector3(0,0,1));     
        blocks.push(new Vector3(1,0,0));     
        blocks.push(new Vector3(-1,0,0));     
        //

        retPiece = new Piece(blocks,O_color, new Vector3(0,18,0));
        break;
        }
        case 8://RANDOM
        {
        let blocks = [];
        blocks.push(new Vector3(0,0,0));     
        blocks.push(new Vector3(1,1,1));     
        blocks.push(new Vector3(1,0,1));     
        blocks.push(new Vector3(0,0,1));     
        //

        retPiece = new Piece(blocks,O_color, new Vector3(0,18,0));
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
