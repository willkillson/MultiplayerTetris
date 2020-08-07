
//NodeImports
// @ts-ignore
import * as THREE from 'three';

export const PIECE_MAP = new Map<number,string>();

PIECE_MAP.set(0,'T');
PIECE_MAP.set(1,'S');
PIECE_MAP.set(2,'I');
PIECE_MAP.set(3,'L');
PIECE_MAP.set(4,'J');
PIECE_MAP.set(5,'Z');
PIECE_MAP.set(6,'O');
PIECE_MAP.set(7,'RANDOM1');
PIECE_MAP.set(8,'RANDOM2');
PIECE_MAP.set(9,'CUBE');

export const BLOCK_POSITIONS = new Map<string, THREE.Vector3[]>();

const tBlock = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, -1, 0)];
BLOCK_POSITIONS.set('T',tBlock);

const sBlock = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 1, 0)];
BLOCK_POSITIONS.set('S',sBlock);

const iBlock = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(2, 0, 0)];
BLOCK_POSITIONS.set('I',iBlock);

const lBlock = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-1, -1, 0)];
BLOCK_POSITIONS.set('L',lBlock);

const jBlock = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1, -1, 0)];
BLOCK_POSITIONS.set('J',jBlock);

const zBlock = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(1, -1, 0)];
BLOCK_POSITIONS.set('Z',zBlock);

const oBlock = [
    new THREE.Vector3(0, 0, 0), // top left
    new THREE.Vector3(1, 0, 0), // top right
    new THREE.Vector3(1, -1, 0), // bot right
    new THREE.Vector3(0, -1, 0)];// bot left
BLOCK_POSITIONS.set('O',oBlock);

const singleBlock =[
    new THREE.Vector3(0, 0, 0),
  ];
BLOCK_POSITIONS.set('CUBE', singleBlock);

const I_COLOR: number = 0xffa500;
const T_COLOR: number = 0xadd8e6;
const L_COLOR: number = 0xfed8b1;
const J_COLOR: number = 0x0000ff;
const S_COLOR: number = 0x800080;
const Z_COLOR: number = 0x00ff00;
const O_COLOR: number = 0xffff00;

export const PIECE_COLOR_MAP = new Map<number,number>();

PIECE_COLOR_MAP.set(0,I_COLOR);
PIECE_COLOR_MAP.set(1,T_COLOR);
PIECE_COLOR_MAP.set(2,L_COLOR);
PIECE_COLOR_MAP.set(3,J_COLOR);
PIECE_COLOR_MAP.set(4,S_COLOR);
PIECE_COLOR_MAP.set(5,Z_COLOR);
PIECE_COLOR_MAP.set(6,O_COLOR);
PIECE_COLOR_MAP.set(7, 0xffffff);
PIECE_COLOR_MAP.set(8, 0xffffff);
PIECE_COLOR_MAP.set(9, 0xffffff);


