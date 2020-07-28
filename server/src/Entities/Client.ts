import * as THREE from 'three';
import * as PIECE from './Piece'

export class Client{
    public id: string;
    public position: THREE.Vector3;
    public rotation: THREE.Vector3; //Euler angle
    public pieceType: number | null;
  
    constructor(piece: PIECE.Piece){
      this.id = "";
      this.position = piece.position;
      this.rotation = piece.rotation;
      this.pieceType = piece.pieceType;
    }
  
    updatePiece(piece: PIECE.Piece){
      this.position = piece.position;
      this.rotation = piece.rotation;
      this.pieceType = piece.pieceType;
    }
  
    generateNewPiece(){
      this.updatePiece(new PIECE.Piece());
    }
  
  }