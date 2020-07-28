import * as THREE from 'three';

export class Piece{
    public position: THREE.Vector3;
    public rotation: THREE.Vector3;
    public pieceType: number;
  
    constructor(){
        //assign position
        this.position = new THREE.Vector3(0,18,0);
        
        //assign euler angle
        this.rotation = new THREE.Vector3(0,0,0);
  
        this.pieceType = Math.floor(Math.random()*7);            
    }
  }