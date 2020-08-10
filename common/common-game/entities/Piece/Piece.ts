
// @ts-ignore
import * as THREE from 'three';

//Local Imports

//TODO: Refactor
//import * as COMMAND from '../../../Controls/Command';

import * as MyConstants from './PieceConstants';
import * as T from '../../../common-utilities/types'
import * as COMMAND from '../../control/Command';


interface Directions {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  in: boolean;
  out: boolean;
  cw: boolean;
  ccw: boolean;
}

/**
 * Main Piece class. Contains methods involved with moveing,
 * and checking boundaries for collision.
 */
export class LocalPlayerPiece {
    private color: number;
    private blocks: THREE.Vector3[];
    private collision_isBlocked: Directions;
    public mesh: THREE.Object3D;

    private ignoreCollision: string;

                // @ts-ignore
    private blockNormals: THREE.Ray[];
                // @ts-ignore
    private x_neg_rcs: THREE.Ray[];
                // @ts-ignore
    private x_pos_rcs: THREE.Ray[];
                // @ts-ignore
    private y_pos_rcs: THREE.Ray[];
                // @ts-ignore
    private y_neg_rcs: THREE.Ray[];
                // @ts-ignore
    private z_pos_rcs: THREE.Ray[];
                // @ts-ignore
    private z_neg_rcs: THREE.Ray[];

    constructor(
        scene:THREE.Scene, 
        client:T.Client) {

        /*

        interface UserData
            entityType: string;
            owner: string;
            pieceType: number;

        */

        let userData = <T.UserData>{};
        userData.entityType = "playerPiece";
        userData.owner = client.id;
                    // @ts-ignore
        userData.pieceType = client.pieceType;
        userData.clientInfo = client;
        
            // @ts-ignore
        this.color = MyConstants.PIECE_COLOR_MAP.get(client.pieceType);
                    // @ts-ignore
        this.blocks = MyConstants.BLOCK_POSITIONS.get(MyConstants.PIECE_MAP.get(client.pieceType));
        this.mesh = new THREE.Object3D();
        this.mesh.position.add(client.position);
        this.mesh.userData = userData;
        this.mesh.name = this.mesh.userData.entityType;
        

        scene.add(this.mesh);
    
        this.ignoreCollision = 'playerPiece';
        this.collision_isBlocked = <Directions>{};
        this.initClassVariables();
        this.initCollisionVariables();

        //TODO: Testing
        //this.initRaycasters();
    }

    ////////////////////////////
    //PUBLIC FUNCTIONS

    /**
     * 
     * @param command will be of type
     */
    public processCommand(command:COMMAND.Command<any>) {
        //handle movement
        switch(command.cmdType){
            case 'movement':
                return this.processMovement(command.cmdValue);
            case 'rotation':
                return this.processRotation(command.cmdValue);
            default:
                return false;
        }
    }

    public syncPiece(info:T.Client){    
        if(this.mesh.userData.pieceType!==info.pieceType){
            console.log(Date.now().toString() +" - PIECE MISMATCH!!!!");
        }
        this.mesh.position.set(info.position.x,info.position.y,info.position.z);
        this.mesh.rotation.set(info.rotation.x,info.rotation.y,info.rotation.z);   
    }

    public removePiece(){
                    // @ts-ignore
        this.mesh.parent.remove(this.mesh);
    }
    
    public getClientInfo(): T.Client{
        this.syncClientInfo();
        return this.mesh.userData.clientInfo;
    }

    ////////////////////////////
    //INITIALIZATION

    private initClassVariables() {
        this.mesh.name = 'playerPiece';
        // create the blocks
        for (let i = 0; i< this.blocks.length; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial( {color: this.color} );
        let newMesh = new THREE.Mesh(geometry, material);
        newMesh.userData = this.mesh.userData;
        this.mesh.add(newMesh);
    }

    // put the blocks where it needs to go
    for (let i = 0; i< this.blocks.length; i++) {
      this.mesh.children[i].position.add(this.blocks[i]);
    }

    // block normals for calculating each faces normal as it changes
    this.blockNormals = [];
    this.blocks.forEach((block)=>{
      this.blockNormals.push(new THREE.Ray(block, new THREE.Vector3(-1, 0, 0)));
      this.blockNormals.push(new THREE.Ray(block, new THREE.Vector3(1, 0, 0)));
      this.blockNormals.push(new THREE.Ray(block, new THREE.Vector3(0, -1, 0)));
      this.blockNormals.push(new THREE.Ray(block, new THREE.Vector3(0, 1, 0)));
      this.blockNormals.push(new THREE.Ray(block, new THREE.Vector3(0, 0, -1)));
      this.blockNormals.push(new THREE.Ray(block, new THREE.Vector3(0, 0, 1)));
    });
    }

    private initCollisionVariables() {
        this.collision_isBlocked['down'] = false;
        this.collision_isBlocked['left'] = false;
        this.collision_isBlocked['right'] = false;
        this.collision_isBlocked['in'] = false;
        this.collision_isBlocked['out'] = false;
        this.collision_isBlocked['cw'] = false;
        this.collision_isBlocked['ccw'] = false;
    }

    private initRaycasters() {
        this.x_neg_rcs = [];// collect all same facing raycasters
        this.x_pos_rcs = [];
        this.y_pos_rcs = [];
        this.y_neg_rcs = [];
        this.z_pos_rcs = [];
        this.z_neg_rcs = [];

        for (let i = 0; i< this.blockNormals.length; i++) {
            // apply the rotation to the raycasters direction
            const ray = this.blockNormals[i];
            const origin = ray.origin;
            const dir = ray.direction;

            let rotatedDirection = new THREE.Vector3(dir.x, dir.y, dir.z);
            let rotatedPosition = new THREE.Vector3(origin.x, origin.y, origin.z);


            rotatedDirection = rotatedDirection.applyQuaternion(this.mesh.quaternion);
            rotatedDirection.x = Math.round(rotatedDirection.x);
            rotatedDirection.y = Math.round(rotatedDirection.y);
            rotatedDirection.z = Math.round(rotatedDirection.z);
            rotatedPosition = rotatedPosition.applyQuaternion(this.mesh.quaternion);
            rotatedPosition.add(this.mesh.position);

            const rotatedRay = new THREE.Ray(rotatedPosition, rotatedDirection);
            // then check which direction it is now facing

            if (rotatedRay.direction.x === -1 &&
                    rotatedRay.direction.y === 0 &&
                    rotatedRay.direction.z === 0) {
            this.x_neg_rcs.push(rotatedRay);// LEFT
            }
            if (rotatedRay.direction.x === 1 &&
                        rotatedRay.direction.y === 0 &&
                        rotatedRay.direction.z === 0) {
            this.x_pos_rcs.push(rotatedRay);// RIGHT
            }
            if (rotatedRay.direction.x === 0 &&
                        rotatedRay.direction.y === 1 &&
                        rotatedRay.direction.z === 0) {
            this.y_pos_rcs.push(rotatedRay);// UP
            }
            if (rotatedRay.direction.x === 0 &&
                        rotatedRay.direction.y === -1 &&
                        rotatedRay.direction.z === 0) {
            this.y_neg_rcs.push(rotatedRay);// DOWN
            }
            if (rotatedRay.direction.x === 0 &&
                        rotatedRay.direction.y === 0 &&
                        rotatedRay.direction.z === -1) {
            this.z_pos_rcs.push(rotatedRay);// IN
            }
            if (rotatedRay.direction.x === 0 &&
                        rotatedRay.direction.y === 0 &&
                        rotatedRay.direction.z === 1) {
            this.z_neg_rcs.push(rotatedRay);// OUT
            }
        }
    }

    ////////////////////////////
    //MOVEMENT

    private processMovement(cmdValue:THREE.Vector3):void {
        this.mesh.position.add(cmdValue);
    }

    private processRotation( cmdValue:THREE.Vector3 ):void {
        this.mesh.rotation.z += cmdValue.z;
    }

    ////////////////////////////
    //COLLISION
    public validateCommand(cmd:COMMAND.Command<any>):boolean {
        // //Get the most current collision detection.
        // this.initRaycasters();
        // let isAllowed = false;
        // if(cmd.cmdType==='rotation'){
        //     this.checkCollisionCCW();
        //     this.checkCollisionCW();
        //     if(cmd.cmdValue.z===-Math.PI/2){//ccw
        //         isAllowed = !this.collision_isBlocked.ccw;
        //     } else if( cmd.cmdValue.z === Math.PI/2 ){//cw
        //         isAllowed = !this.collision_isBlocked.cw;
        //     } 
        // }else if(cmd.cmdType==='movement'){
        //     this.checkCollisionUp();
        //     this.checkCollisionDown();
        //     this.checkCollisionLeft();
        //     this.checkCollisionRight();
        //     if(cmd.cmdValue.x===-1){
        //         isAllowed = !this.collision_isBlocked.left;
        //     } else if( cmd.cmdValue.x === 1 ){
        //         isAllowed = !this.collision_isBlocked.right;
        //     } else if( cmd.cmdValue.y === -1 ){
        //         isAllowed = !this.collision_isBlocked.down;
        //     }
        // }
        // return isAllowed;

        //TODO:Testing
        return true;
    }

    private checkCollisionIntersections(pUUID:string, pMesh:THREE.Object3D, pScene:THREE.Scene, pRot:THREE.Quaternion) {
        const scene = pScene;
        const uuid = pUUID;

        //all blocks that we will collide with
        const allBlocks:any = [];

        scene.children.filter((child)=>{
        //console.log(child.userData.entityType);
        return child.userData.entityType==="persistentBlock" || child.userData.entityType=== "frame";
        }).forEach(block=>{
        if(block.userData.entityType==="frame"){
        block.children.forEach(subChild=>{
        const box = new THREE.Box3().setFromObject(subChild);//frame has children which are the blocks
        allBlocks.push(box);
        })
        } else if (block.userData.entityType==="persistentBlock"){
        const box = new THREE.Box3().setFromObject(block);//persistent blocks are the top level.
        allBlocks.push(box);
        }
        });

        let intersects = false;

        pMesh.applyQuaternion(pRot);
        pMesh.updateMatrixWorld(true); // Updates the global transform of the object and its descendants.


        pMesh.children.forEach((child)=>{
        const currentBox= new THREE.Box3().setFromObject(child);

        currentBox.max.x = parseFloat(currentBox.max.x.toFixed(2));
        currentBox.max.y = parseFloat(currentBox.max.y.toFixed(2));
        currentBox.max.z = parseFloat(currentBox.max.z.toFixed(2));

        currentBox.min.x = parseFloat(currentBox.min.x.toFixed(2));
        currentBox.min.y = parseFloat(currentBox.min.y.toFixed(2));
        currentBox.min.z = parseFloat(currentBox.min.z.toFixed(2));

        allBlocks.forEach((block:any)=>{
        if (currentBox.containsBox(block)) {
        intersects=true;
        }
        });
        });

        return intersects;
    }
    
    private checkCollisionUp() {
        const allIntersections:any = [];
        this.y_pos_rcs.forEach((ray) => {
            const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
                        // @ts-ignore
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
        });
        // remove all the intersections with the pieces self
        const intersects:any = [];
        allIntersections.forEach((intersection:THREE.Intersection)=>{
                        // @ts-ignore
            if (intersection.object.parent.uuid!==this.mesh.uuid) {
            if(intersection.object.userData.entityType!==this.ignoreCollision){
                intersects.push(intersection);
            }
            }
        });

        //console.log(intersects);

        if (intersects.length===0) {
            this.collision_isBlocked['up'] = false;
        } else {
            this.collision_isBlocked['up'] = true;
    }
    }

    private checkCollisionDown() {
        const allIntersections:any = [];
        this.y_neg_rcs.forEach((ray) => {
            const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
                        // @ts-ignore
            allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
        });
        // remove all the intersections with the pieces self
        const intersects:any = [];
        allIntersections.forEach((intersection:THREE.Intersection)=>{
                        // @ts-ignore
            if (intersection.object.parent.uuid!==this.mesh.uuid) {
            if(intersection.object.userData.entityType!==this.ignoreCollision){
                intersects.push(intersection);
            }
            }
        });
        if (intersects.length===0) {
            this.collision_isBlocked['down'] = false;
        } else {
            this.collision_isBlocked['down'] = true;
        }
    }

    private checkCollisionLeft() {
    const allIntersections:any = [];
    this.x_neg_rcs.forEach((ray) => {
        const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
                    // @ts-ignore
        allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects:any = [];
    allIntersections.forEach((intersection:THREE.Intersection)=>{
                    // @ts-ignore
        if (intersection.object.parent.uuid!==this.mesh.uuid) {
        if(intersection.object.userData.entityType!==this.ignoreCollision){
            intersects.push(intersection);
        }
        }
    });

    if (intersects.length===0) {
        this.collision_isBlocked['left'] = false;
    } else {
        this.collision_isBlocked['left'] = true;
    }
    }

    private checkCollisionRight() {
    const allIntersections:any = [];
    this.x_pos_rcs.forEach((ray) => {
        const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
                    // @ts-ignore
        allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects:any = [];

    allIntersections.forEach((intersection:THREE.Intersection)=>{
                    // @ts-ignore
        if (intersection.object.parent.uuid!==this.mesh.uuid) {
        if(intersection.object.userData.entityType!==this.ignoreCollision){
            intersects.push(intersection);
        }
        }
    });


    //console.log(intersects);

    if (intersects.length===0) {
        this.collision_isBlocked['right'] = false;
    } else {
        this.collision_isBlocked['right'] = true;
    }
    }

    private checkCollisionIn() {
    const allIntersections:any = [];
    this.z_pos_rcs.forEach((ray) => {
        const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
                    // @ts-ignore
        allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects:any = [];
    allIntersections.forEach((intersection:THREE.Intersection)=>{
                    // @ts-ignore
        if (intersection.object.parent.uuid!==this.mesh.uuid) {
        if(intersection.object.userData.entityType!==this.ignoreCollision){
            intersects.push(intersection);
        }
        }
    });

    if (intersects.length===0) {
        this.collision_isBlocked['in'] = false;
    } else {
        this.collision_isBlocked['in'] = true;
    }
    }

    private checkCollisionOut() {
    const allIntersections:any = [];
    this.z_neg_rcs.forEach((ray) => {
        const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
                    // @ts-ignore
        allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects:any = [];
    allIntersections.forEach((intersection:THREE.Intersection)=>{
                    // @ts-ignore
        if (intersection.object.parent.uuid!==this.mesh.uuid) {
        if(intersection.object.userData.entityType!==this.ignoreCollision){
            intersects.push(intersection);
        }
        }
    });

    if (intersects.length===0) {
        this.collision_isBlocked['out'] = false;
    } else {
        this.collision_isBlocked['out'] = true;
    }
    }

    private checkCollisionCCW() {
    const rotCW = new THREE.Quaternion(0, 0, 0, 0);
    rotCW.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/2);

    const cMesh = this.mesh.clone(true);
    const scene:any = this.mesh.parent;
    const uuid = this.mesh.uuid;

    const decision = this.checkCollisionIntersections(uuid, cMesh, scene, rotCW);


    if (decision) {
        this.collision_isBlocked.ccw = true;
    } else {
        this.collision_isBlocked.ccw = false;
    }
    }

    private checkCollisionCW() {
    const rotCW = new THREE.Quaternion(0, 0, 0, 0);
    rotCW.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/2);

    const cMesh = this.mesh.clone(true);
    const scene:any = this.mesh.parent;
    const uuid = this.mesh.uuid;

    const decision = this.checkCollisionIntersections(uuid, cMesh, scene, rotCW);


    if (decision) {
        this.collision_isBlocked.cw = true;
    } else {
        this.collision_isBlocked.cw = false;
    }
    }

    private syncClientInfo(){

        /*
            let userData = <T.UserData>{};
            userData.entityType = "playerPiece";
            userData.owner = client.id;
            userData.pieceType = client.pieceType;
            userData.clientInfo = client;
            
            interface Client{
                id: string,
                position: THREE.Vector3,
                rotation: THREE.Vector3,
                pieceType: number | null
            }
        */

        try{
            this.mesh.userData.clientInfo.position = this.mesh.position;
            this.mesh.userData.clientInfo.rotation = this.mesh.rotation;
        }catch (error){
            console.error(error);
        }
    }
}

/**
 * Main Piece class. Contains methods involved with moveing,
 * and checking boundaries for collision.
 */
export class NetworkPlayerPiece {
    color: number;
    blocks: THREE.Vector3[];
                // @ts-ignore
    collision_isBlocked: Directions;
    mesh: THREE.Object3D;
    blocksWorldPositions: THREE.Vector3[];

    constructor( scene:THREE.Scene, client:T.Client ) {

        let userData = <T.UserData>{};
        userData.entityType = "playerPiece";
        userData.owner = client.id;
                    // @ts-ignore
        userData.pieceType = client.pieceType;
        userData.clientInfo = client;

            // @ts-ignore
        this.color = MyConstants.PIECE_COLOR_MAP.get(client.pieceType);
                    // @ts-ignore
        this.blocks = MyConstants.BLOCK_POSITIONS.get(MyConstants.PIECE_MAP.get(client.pieceType));

        this.mesh = new THREE.Object3D();
        this.mesh.position.add(client.position);
        this.mesh.userData = userData;
        this.mesh.name = this.mesh.userData.entityType;

        scene.add(this.mesh);
        this.blocksWorldPositions = [];

        this.initClassVariables();

    }

    private initClassVariables() {
        // create the blocks
        for (let i = 0; i< this.blocks.length; i++) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshLambertMaterial( {color: this.color} );
            let newMesh = new THREE.Mesh(geometry, material);
            newMesh.userData = this.mesh.userData;
            this.mesh.add(newMesh);
            this.blocksWorldPositions.push(new THREE.Vector3(0,0,0));
        }

        // put the blocks where it needs to go
        for (let i = 0; i< this.blocks.length; i++) {
        this.mesh.children[i].position.add(this.blocks[i]);
        }
    }

    public processCommand(command:COMMAND.Command<any>) {
        //handle movement
        switch(command.cmdType){
            case 'movement':
                return this.processMovement(command.cmdValue);
            case 'rotation':
                return this.processRotation(command.cmdValue);
            default:
                return false;
        }
    }

    private processMovement(cmdValue:THREE.Vector3):void {
        this.mesh.position.add(cmdValue);
    }

    private processRotation( cmdValue:THREE.Vector3 ):void {
        this.mesh.rotation.z += cmdValue.z;
    }

    public syncPiece(info:T.Client){

        let pm = MyConstants.PIECE_MAP;
        let cm = MyConstants.PIECE_COLOR_MAP;
        let bm = MyConstants.BLOCK_POSITIONS;//block map

        let pt = info.pieceType;
            // @ts-ignore
        this.color = cm.get(pt);
            // @ts-ignore
        this.blocks = bm.get(pm.get(pt));

        while(this.mesh.children.length>0){
        this.mesh.children.shift();
        }
        
        this.mesh.position.set(info.position.x,info.position.y,info.position.z);
        this.mesh.rotation.set(info.rotation.x,info.rotation.y,info.rotation.z);

        let userData = <T.UserData>{};
        userData.entityType = "playerPiece"
        userData.owner = info.id;
                    // @ts-ignore
        userData.pieceType = pt;

        this.mesh.userData = userData;
        this.mesh.name = this.mesh.userData.entityType;
        
        this.initClassVariables();

    }

    private syncClientInfo(){

        /*
            let userData = <T.UserData>{};
            userData.entityType = "playerPiece";
            userData.owner = client.id;
            userData.pieceType = client.pieceType;
            userData.clientInfo = client;
            
            interface Client{
                id: string,
                position: THREE.Vector3,
                rotation: THREE.Vector3,
                pieceType: number | null
            }
        */
       try{
        this.mesh.userData.clientInfo.position = this.mesh.position;
        this.mesh.userData.clientInfo.rotation = this.mesh.rotation;
       }catch (error){
           console.error(error);
       }

    }

    public getClientInfo(): T.Client{
        this.syncClientInfo();
        return this.mesh.userData.clientInfo;
    }

}