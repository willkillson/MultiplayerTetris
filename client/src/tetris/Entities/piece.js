import {BoxGeometry, MeshBasicMaterial, Mesh, Raycaster, Ray} from 'three';
import * as THREE from 'three';
import {Vector3} from 'three';
import * as MyConstants from '../utilities/constants'

/**
 * Main Piece class. Contains methods involved with moveing,
 * and checking boundaries for collision.
 */
export class Piece {
  
  constructor(pBlockPositions, pColor, pPos, userData= {
    entityType : "active_piece",
    owner : 'NA'}) {
    // class variables
    this.color = pColor;
    this.blockPositions = pBlockPositions;
    this.startingPosition = pPos;
    this.userData = userData;

    this.ignoreCollision = 'active_piece';


    this.initClassVariables();
    this.initCollisionVariables();
    this.initRaycasters();
  }

  // initialization
  initClassVariables() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'cube';

    // create the blocks
    for (let i = 0; i< this.blockPositions.length; i++) {
      const geometry = new BoxGeometry(1, 1, 1);
      const material = new MeshBasicMaterial( {color: this.color} );
      let newMesh = new Mesh(geometry, material);
      newMesh.userData = this.userData;
      this.mesh.add(newMesh);
    }

    // put the blocks where it needs to go
    for (let i = 0; i< this.blockPositions.length; i++) {
      this.mesh.children[i].position.add(this.blockPositions[i]);
    }

    // move the group object to its starting position
    this.mesh.position.add(this.startingPosition);

    // block normals for calculating each faces normal as it changes
    this.blockNormals = [];
    this.blockPositions.forEach((block)=>{
      this.blockNormals.push(new Ray(block, new Vector3(-1, 0, 0)));
      this.blockNormals.push(new Ray(block, new Vector3(1, 0, 0)));
      this.blockNormals.push(new Ray(block, new Vector3(0, -1, 0)));
      this.blockNormals.push(new Ray(block, new Vector3(0, 1, 0)));
      this.blockNormals.push(new Ray(block, new Vector3(0, 0, -1)));
      this.blockNormals.push(new Ray(block, new Vector3(0, 0, 1)));
    });
  }

  initCollisionVariables() {
    this.collisionExclusion = [];
    this.collisionExclusion.push("active_piece");

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

      let rotatedDirection = new Vector3(dir.x, dir.y, dir.z);
      let rotatedPosition = new Vector3(origin.x, origin.y, origin.z);


      rotatedDirection = rotatedDirection.applyQuaternion(this.mesh.quaternion);
      rotatedDirection.x = Math.round(rotatedDirection.x);
      rotatedDirection.y = Math.round(rotatedDirection.y);
      rotatedDirection.z = Math.round(rotatedDirection.z);
      rotatedPosition = rotatedPosition.applyQuaternion(this.mesh.quaternion);
      rotatedPosition.add(this.mesh.position);

      const rotatedRay = new Ray(rotatedPosition, rotatedDirection);
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
      const rayCaster = new Raycaster(ray.origin, ray.direction, 0.1, 1);
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
      const rayCaster = new Raycaster(ray.origin, ray.direction, 0.1, 1);
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
      const rayCaster = new Raycaster(ray.origin, ray.direction, 0.1, 1);
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
      const rayCaster = new Raycaster(ray.origin, ray.direction, 0.1, 1);
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

    
    console.log(intersects);

    if (intersects.length===0) {
      this.collision_isBlocked['right'] = false;
    } else {
      this.collision_isBlocked['right'] = true;
    }
  }

  checkCollisionIn() {
    const allIntersections = [];
    this.z_pos_rcs.forEach((ray) => {
      const rayCaster = new Raycaster(ray.origin, ray.direction, 0.1, 1);
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
      const rayCaster = new Raycaster(ray.origin, ray.direction, 0.1, 1);
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
}

export const createPiece = (pieceType = 0, defaultPosition = new Vector3(0, 18, 0)) =>{

  let retPiece;

  switch (pieceType) {
    case 0:// T
    {
      const blocks = [
        new Vector3(0, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(0, -1, 0)];
      retPiece = new Piece(blocks, MyConstants.T_COLOR, defaultPosition);
      break;
    }
    case 1:// S
    {
      const blocks = [
        new Vector3(0, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(0, 1, 0),
        new Vector3(1, 1, 0)];
      retPiece = new Piece(blocks, MyConstants.S_COLOR, defaultPosition);
      break;
    }
    case 2:// I
    {
      const blocks = [
        new Vector3(0, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(2, 0, 0)];
      retPiece = new Piece(blocks, MyConstants.I_COLOR, defaultPosition);
      break;
    }
    case 3:// L
    {
      const blocks = [
        new Vector3(0, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(-1, -1, 0)];
      retPiece = new Piece(blocks, MyConstants.L_COLOR, defaultPosition);
      break;
    }
    case 4:// J
    {
      const blocks = [
        new Vector3(0, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(1, 0, 0),
        new Vector3(1, -1, 0)];

      retPiece = new Piece(blocks, MyConstants.J_COLOR, defaultPosition);
      break;
    }
    case 5:// Z
    {
      const blocks = [
        new Vector3(0, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(0, -1, 0),
        new Vector3(1, -1, 0)];

      retPiece = new Piece(blocks, MyConstants.Z_COLOR, defaultPosition);
      break;
    }
    case 6:// O
    {
      const blocks = [
        new Vector3(0, 0, 0), // top left
        new Vector3(1, 0, 0), // top right
        new Vector3(1, -1, 0), // bot right
        new Vector3(0, -1, 0)];// bot left
      retPiece = new Piece(blocks, MyConstants.O_COLOR, defaultPosition);
      break;
    }
    case 7:// RANDOM
    {
      const blocks = [];
      blocks.push(new Vector3(0, 0, -1));
      blocks.push(new Vector3(0, 0, 1));
      blocks.push(new Vector3(1, 0, 0));
      blocks.push(new Vector3(-1, 0, 0));
      //

      retPiece = new Piece(blocks, MyConstants.O_COLOR, defaultPosition);
      break;
    }
    case 8:// RANDOM
    {
      const blocks = [];
      blocks.push(new Vector3(0, 0, 0));
      blocks.push(new Vector3(1, 1, 1));
      blocks.push(new Vector3(1, 0, 1));
      blocks.push(new Vector3(0, 0, 1));
      //

      retPiece = new Piece(blocks, MyConstants.O_COLOR, defaultPosition);
      break;
    }
    case 9:// single cube
    {
      const blocks =[
        new Vector3(0, 0, 0),
      ];
      retPiece = new Piece(blocks, 0xffffff, defaultPosition);
      break;
    }
    default:// single cube
    {
      const blocks =[
        new Vector3(0, 0, 0),
      ];
      retPiece = new Piece(blocks, 0xffffff, defaultPosition);
      break;
    }
  }

  return retPiece;
};

