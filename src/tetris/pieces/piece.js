import {BoxGeometry, MeshBasicMaterial, Mesh} from "three";
import * as THREE from 'three';
import{Vector3} from 'three';

class Piece{
    

    constructor(pBlockPositions, pColor, pPos, pCollisionChecks){
        //class variables
        this.color = pColor;
        this.blockPositions = pBlockPositions; 
        this.position = pPos;

        /**
         *      collision checks
         * 
         *  This is an object of arrays. It contains
         *  'up', 'down', 'left', 'right' key:Arrays, where 
         *  the arrays contain the block index positions that
         *  require collision checks on the key's direction. 
         */
        this.collisionChecks = pCollisionChecks;

        this.initClassVariables();
        this.initCollisionVariables();
        this.initRaycasters();

    }

    // //initialization
    // initClassVariables(){
    //     this.mesh = new THREE.Object3D();
    //     this.mesh.name = "cube";
    //     console.log(this.blockPositions);
    //     this.blockPositions.forEach((pos)=>{
    //         let geometry = new BoxGeometry(1,1,1);
    //         let material = new MeshBasicMaterial( { color: this.color } );
    //         geometry.translate(
    //             pos.toArray()[0],
    //             pos.toArray()[1],
    //             pos.toArray()[2]);
    //         let mesh = new Mesh(geometry,material);
    //         this.mesh.add(mesh);
    //     });
    //     this.mesh.position.add(this.position);
    // }

    //initialization
    initClassVariables(){
        this.mesh = new THREE.Object3D();
        this.mesh.name = "cube";

        for(let i = 0;i< this.blockPositions.length;i++){
            let geometry = new BoxGeometry(1,1,1);
            let material = new MeshBasicMaterial( { color: this.color } );
            this.mesh.add(new Mesh(geometry,material));
        }

        for(let i = 0;i< this.blockPositions.length;i++){
            this.mesh.children[i].position.add(this.blockPositions[i]);
        }
    
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

        /**
         * Is an array of raycasters that are used 
         * to determine if a direction is blocked.
         */
        this.upRaycasters = [];
        this.downRaycasters = [];
        this.leftRaycasters = [];
        this.rightRaycasters = [];

        let upChecks = this.collisionChecks['up'];
        let downChecks = this.collisionChecks['down'];
        let leftChecks = this.collisionChecks['left'];
        let rightChecks = this.collisionChecks['right'];

        upChecks.forEach(check =>{
            let pos = new Vector3(0,0,0);                   //calculate position of raycaster
            pos.add(this.mesh.position);                    //the position of the group mesh
            pos.add(this.mesh.children[check].position);    //plus the position of the individual cube
            this.upRaycasters.push(new THREE.Raycaster(pos,new Vector3(0,1,0),near,far));
        })

        downChecks.forEach(check =>{
            let pos = new Vector3(0,0,0);                   //calculate position of raycaster
            pos.add(this.mesh.position);                    //the position of the group mesh
            pos.add(this.mesh.children[check].position);    //plus the position of the individual cube
            this.downRaycasters.push(new THREE.Raycaster(pos,new Vector3(0,-1,0),near,far));
        })

        
        leftChecks.forEach(check =>{
            let pos = new Vector3(0,0,0);                   //calculate position of raycaster
            pos.add(this.mesh.position);                    //the position of the group mesh
            pos.add(this.mesh.children[check].position);    //plus the position of the individual cube
            this.leftRaycasters.push(new THREE.Raycaster(pos,new Vector3(-1,0,0),near,far));
        })

        //console.log(this.mesh.position);
        //console.log(this.mesh.children);
        rightChecks.forEach(check =>{
            let pos = new Vector3(0,0,0);                   //calculate position of raycaster
            pos.add(this.mesh.position);                    //the position of the group mesh
            pos.add(this.mesh.children[check].position);    //plus the position of the individual cube
            
            this.rightRaycasters.push(new THREE.Raycaster(pos,new Vector3(1,0,0),near,far));
        })

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
        this.initRaycasters();

        this.checkCollisionUp();
        this.checkCollisionDown();
        this.checkCollisionLeft();
        this.checkCollisionRight();
    }

    checkCollisionUp(){
    
        let intersects = [];
        this.upRaycasters.forEach(raycaster => {
            intersects.push(...raycaster.intersectObjects(this.mesh.parent.children,true));
        });

       if(intersects.length===0){
           this.collision_isBlocked['up'] = false;
       }
       else{
           this.collision_isBlocked['up'] = true;
       }
    }

    checkCollisionDown(){
        let intersects = [];
        this.downRaycasters.forEach(raycaster => {
            intersects.push(...raycaster.intersectObjects(this.mesh.parent.children,true));
        });
        if(intersects.length===0){
            this.collision_isBlocked['down'] = false;
        }
        else{
            this.collision_isBlocked['down'] = true;
        }

 
    }

    checkCollisionLeft(){
        let intersects = [];
        this.leftRaycasters.forEach(raycaster => {
            intersects.push(...raycaster.intersectObjects(this.mesh.parent.children,true));
        });
        if(intersects.length===0){
            this.collision_isBlocked['left'] = false;
        }
        else{
            this.collision_isBlocked['left'] = true;
        }
 
    }

    checkCollisionRight(){
        let intersects = [];
        this.rightRaycasters.forEach(raycaster => {
            intersects.push(...raycaster.intersectObjects(this.mesh.parent.children,true));
        });
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
                new Vector3(0,0,0),//top left
                new Vector3(1,0,0),//top right
                new Vector3(1,-1,0),//bot right
                new Vector3(0,-1,0)];//bot left

            let upCollisionChecks = [];
            upCollisionChecks.push(0);
            upCollisionChecks.push(1);

            let downCollisionChecks = [];
            downCollisionChecks.push(2);
            downCollisionChecks.push(3);

            let leftCollisionChecks = [];
            leftCollisionChecks.push(0);
            leftCollisionChecks.push(3);

            let rightCollisionChecks = [];
            rightCollisionChecks.push(1);
            rightCollisionChecks.push(2);

            let collisionChecks = {};
            collisionChecks['up'] = upCollisionChecks;
            collisionChecks['down'] = downCollisionChecks;
            collisionChecks['left'] = leftCollisionChecks;
            collisionChecks['right'] = rightCollisionChecks;

            retPiece = new Piece(blocks,O_color, new Vector3(0,18,0), collisionChecks);
            break;
        }
        default ://single cube
        {
                let blocks =[
                    new Vector3(0,0,0)
                ]
                
                let upCollisionChecks = [];
                upCollisionChecks.push(0);

                let downCollisionChecks = [];
                downCollisionChecks.push(0);

                let leftCollisionChecks = [];
                leftCollisionChecks.push(0);

                let rightCollisionChecks = [];
                rightCollisionChecks.push(0);

                let collisionChecks = {};
                collisionChecks['up'] = upCollisionChecks;
                collisionChecks['down'] = downCollisionChecks;
                collisionChecks['left'] = leftCollisionChecks;
                collisionChecks['right'] = rightCollisionChecks;

                retPiece = new Piece(blocks,0xffffff, new Vector3(0,18,0), collisionChecks);
                break;
        }
    }
    
    return retPiece;
}

export default createPiece;
