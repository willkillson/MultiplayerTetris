
// @ts-ignore
import * as THREE from 'three';

interface ClientInfo{
    id: string;
    users: Client[];
    serverTime:number;
}

interface Client{
    id: string,
    position: THREE.Vector3,
    rotation: THREE.Vector3,
    pieceType: number | null
}

interface Block{
    position: THREE.Vector3,
    color: number,
    uuid: string
}

interface UpdateInfo{
    users:Client[];
    persistentBlocks: Block[];
    serverTime:number;
}
  
interface NewConnectionInfo{
    users:Client[];
    persistentBlocks: Block[];
    serverTime:number;
    clientId:string;
}

interface NetworkInfo{
    users:Client[];
    persistentBlocks: Block[];
    serverTime:number;
    clientId:string;
}

/*
  m3.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }
*/

interface UserData{
    entityType: string;
    owner: string;
    pieceType: number;
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

export type{
    UserData,
    Directions,
    ClientInfo,
    Client,
    Block,
    UpdateInfo,
    NewConnectionInfo,
    NetworkInfo
}