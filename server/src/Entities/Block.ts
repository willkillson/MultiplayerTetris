import { v4 as uuidv4 } from 'node-uuid';
import * as THREE from 'three';


export class Block{

    public uuid: string;
    public position: THREE.Vector3;
    public color: number;
  
    constructor(pPosition:THREE.Vector3, pColor:number){
      this.position = pPosition;
      this.color = pColor;
      this.uuid = uuidv4();
    }
  }
  