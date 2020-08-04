import * as THREE from 'three';

//Local Imports
import * as MyConstants from './PieceConstants';
import * as T from '../../../Util/types';

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
  color: number;
  blocks: THREE.Vector3[];
  collidesWith: Map<string,string>;
  collision_isBlocked: Directions;
  mesh: THREE.Object3D;

  blocksWorldPositions: THREE.Vector3[];
  ignoreCollision: string;

  blockNormals: THREE.Ray[];
  x_neg_rcs: THREE.Ray[];
  x_pos_rcs: THREE.Ray[];
  y_pos_rcs: THREE.Ray[];
  y_neg_rcs: THREE.Ray[];
  z_pos_rcs: THREE.Ray[];
  z_neg_rcs: THREE.Ray[];

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
    userData.pieceType = client.pieceType;

    this.color = MyConstants.PIECE_COLOR_MAP.get(client.pieceType);;
    this.blocks = MyConstants.BLOCK_POSITIONS.get(MyConstants.PIECE_MAP.get(client.pieceType));
    this.collidesWith = new Map();
    this.mesh = new THREE.Object3D();
    this.mesh.position.add(client.position);
    this.mesh.userData = userData;
    this.mesh.name = this.mesh.userData.entityType;

    scene.add(this.mesh);
  

    this.blocksWorldPositions = [];
    this.ignoreCollision = 'active_piece';
    this.collision_isBlocked = <Directions>{};
    this.initClassVariables();
    this.initCollisionVariables();
    this.initRaycasters();
  }

  // initialization
  initClassVariables() {
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

  initCollisionVariables() {
    this.collision_isBlocked['down'] = false;
    this.collision_isBlocked['left'] = false;
    this.collision_isBlocked['right'] = false;
    this.collision_isBlocked['in'] = false;
    this.collision_isBlocked['out'] = false;
    this.collision_isBlocked['cw'] = false;
    this.collision_isBlocked['ccw'] = false;
  }

  initRaycasters() {
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

  update() {
    this.checkAllCollisions();
  }

  // collisions
  checkCollisionIntersections(pUUID, pMesh, pScene, pRot) {
    const scene = pScene;
    const uuid =pUUID;

    const allBlocks = [];
    scene.children.forEach((child)=>{
      child.children.forEach( (subChild)=>{
        if (subChild.parent.uuid!==uuid) {
          const box = new THREE.Box3().setFromObject(subChild);
          allBlocks.push(box);
        }
      });
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

      allBlocks.forEach((block)=>{
        if (currentBox.containsBox(block)) {
          intersects=true;
        }
      });
    });

    return intersects;
  }

  checkAllCollisions() {
    this.initRaycasters();

    this.checkCollisionUp();
    this.checkCollisionDown();
    this.checkCollisionLeft();
    this.checkCollisionRight();
    this.checkCollisionIn();
    this.checkCollisionOut();
    this.checkCollisionCCW();
    this.checkCollisionCW();
  }

  checkCollisionUp() {
    const allIntersections = [];
    this.y_pos_rcs.forEach((ray) => {
      const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
      allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects = [];
    allIntersections.forEach((intersection)=>{
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

  checkCollisionDown() {
    const allIntersections = [];
    this.y_neg_rcs.forEach((ray) => {
      const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
      allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects = [];
    allIntersections.forEach((intersection)=>{
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

  checkCollisionLeft() {
    const allIntersections = [];
    this.x_neg_rcs.forEach((ray) => {
      const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
      allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects = [];
    allIntersections.forEach((intersection)=>{
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

  checkCollisionRight() {
    const allIntersections = [];
    this.x_pos_rcs.forEach((ray) => {
      const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
      allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects = [];
    allIntersections.forEach((intersection)=>{
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

  checkCollisionIn() {
    const allIntersections = [];
    this.z_pos_rcs.forEach((ray) => {
      const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
      allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects = [];
    allIntersections.forEach((intersection)=>{
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

  checkCollisionOut() {
    const allIntersections = [];
    this.z_neg_rcs.forEach((ray) => {
      const rayCaster = new THREE.Raycaster(ray.origin, ray.direction, 0.1, 1);
      allIntersections.push(...rayCaster.intersectObjects(this.mesh.parent.children, true));
    });
    // remove all the intersections with the pieces self
    const intersects = [];
    allIntersections.forEach((intersection)=>{
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

  checkCollisionCCW() {
    const rotCW = new THREE.Quaternion(0, 0, 0, 0);
    rotCW.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/2);

    const cMesh = this.mesh.clone(true);
    const scene = this.mesh.parent;
    const uuid = this.mesh.uuid;

    const decision = this.checkCollisionIntersections(uuid, cMesh, scene, rotCW);


    if (decision) {
      this.collision_isBlocked['CCW'] = true;
    } else {
      this.collision_isBlocked['CCW'] = false;
    }
  }

  checkCollisionCW() {
    const rotCW = new THREE.Quaternion(0, 0, 0, 0);
    rotCW.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/2);

    const cMesh = this.mesh.clone(true);
    const scene = this.mesh.parent;
    const uuid = this.mesh.uuid;

    const decision = this.checkCollisionIntersections(uuid, cMesh, scene, rotCW);


    if (decision) {
      this.collision_isBlocked['CW'] = true;
    } else {
      this.collision_isBlocked['CW'] = false;
    }
  }

  public syncPiece(info:T.Client){    
    if(this.mesh.userData.pieceType!==info.pieceType){
      console.log(Date.now().toString() +" - PIECE MISMATCH!!!!");
    }
    this.mesh.position.set(info.position.x,info.position.y,info.position.z);
    this.mesh.rotation.set(info.rotation.x,info.rotation.y,info.rotation.z);   

  }
}



  /**
 * Main Piece class. Contains methods involved with moveing,
 * and checking boundaries for collision.
 */
export class NetworkPlayerPiece {
  color: number;
  blocks: THREE.Vector3[];
  collidesWith: Map<string,string>;
  collision_isBlocked: Directions;
  mesh: THREE.Object3D;
  blocksWorldPositions: THREE.Vector3[];

  constructor(
    scene:THREE.Scene, 
    blocks:THREE.Vector3[], 
    color:number, 
    position:THREE.Vector3, 
    rotation:THREE.Vector3, 
    userData:T.UserData) {

    this.color = color;
    this.blocks = blocks;
    this.collidesWith = new Map();
    this.mesh = new THREE.Object3D();
    this.mesh.position.add(position);
    this.mesh.userData = userData;
    this.mesh.name = this.mesh.userData.entityType;
    this.mesh.userData.pieceType = userData.pieceType;
  
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

  public syncPiece(info:T.Client){

    let pm = MyConstants.PIECE_MAP;
    let cm = MyConstants.PIECE_COLOR_MAP;
    let bm = MyConstants.BLOCK_POSITIONS;//block map

    let pt = info.pieceType;

    this.color = cm.get(pt);

    this.blocks = bm.get(pm.get(pt));

    while(this.mesh.children.length>0){
      this.mesh.children.shift();
    }
    
    this.mesh.position.set(info.position.x,info.position.y,info.position.z);
    this.mesh.rotation.set(info.rotation.x,info.rotation.y,info.rotation.z);

    let userData = <T.UserData>{};
    userData.entityType = "playerPiece"
    userData.owner = info.id;
    userData.pieceType = pt;

    this.mesh.userData = userData;
    this.mesh.name = this.mesh.userData.entityType;
    
    this.initClassVariables();

  }

}