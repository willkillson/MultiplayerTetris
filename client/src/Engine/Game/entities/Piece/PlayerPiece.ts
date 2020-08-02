import * as THREE from 'three';

//Local Imports
import * as MyConstants from './PieceConstants'

interface UserData{
  entityType: string;
  owner: string;
}

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
export class Piece {
  color: string;
  blocks: THREE.Vector3[];
  userData: {};
  collidesWith: Map<string,string>;
  collision_isBlocked: Directions;
  mesh: THREE.Object3D;

  blocksWorldPositions: THREE.Vector3[];

  constructor(
    scene:THREE.Scene, 
    blocks:THREE.Vector3[], 
    color:string, 
    position:THREE.Vector3, 
    rotation:THREE.Vector3, 
    userData:UserData) {

    this.color = color;
    this.blocks = blocks;
    this.userData = userData;
    this.collidesWith = new Map();
    this.mesh = new THREE.Object3D();
    this.mesh.position.add(position);
    this.mesh.name = 'cube';
  
    scene.add(this.mesh);
    this.blocksWorldPositions = [];

    this.initClassVariables();
    this.initCollisionVariables();
    this.calculateWorldPositions();
  }

  initClassVariables() {
    // create the blocks
    for (let i = 0; i< this.blocks.length; i++) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial( {color: this.color} );
      let newMesh = new THREE.Mesh(geometry, material);
      newMesh.userData = this.userData;
      this.mesh.add(newMesh);
      this.blocksWorldPositions.push(new THREE.Vector3(0,0,0));
    }

    // put the blocks where it needs to go
    for (let i = 0; i< this.blocks.length; i++) {
      this.mesh.children[i].position.add(this.blocks[i]);
    }
  }

  initCollisionVariables() {
    this.collision_isBlocked = <Directions>{};
    this.collision_isBlocked['up'] = false;
    this.collision_isBlocked['down'] = false;
    this.collision_isBlocked['left'] = false;
    this.collision_isBlocked['right'] = false;
    this.collision_isBlocked['in'] = false;
    this.collision_isBlocked['out'] = false;
    this.collision_isBlocked['cw'] = false;
    this.collision_isBlocked['ccw'] = false;
  }

  calculateWorldPositions(){

    for(let i = 0;i< this.mesh.children.length;i++){
      this.mesh.children[i].getWorldPosition(this.blocksWorldPositions[i]);
    }
  }

  update() {
    //calculate world positions of the blocks
    this.calculateWorldPositions();
    // const collisionBlocks =  this.mesh.parent.children.filter(child=>{
    //     return child.userData.entityType==="inactive_piece"||"frame";
    // });



    
  }



  rightBlocks(collisionBlocks: THREE.Object3D[]){
        
    // for(let i = 0;i< this.blocksWorldPositions.length;i++){
    //   let col = collisionBlocks.filter((block)=>{
    //     return block.position.x+1===this.blocksWorldPositions[i].x;
    //   });
    //   console.log(col);
    // }

  }


}