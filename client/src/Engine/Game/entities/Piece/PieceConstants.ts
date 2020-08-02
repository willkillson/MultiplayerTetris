
//NodeImports
import * as THREE from 'three';


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

export const I_COLOR: number = 0xffa500;
export const T_COLOR: number = 0xadd8e6;
export const L_COLOR: number = 0xfed8b1;
export const J_COLOR: number = 0x0000ff;
export const S_COLOR: number = 0x800080;
export const Z_COLOR: number = 0x00ff00;
export const O_COLOR: number = 0xffff00;