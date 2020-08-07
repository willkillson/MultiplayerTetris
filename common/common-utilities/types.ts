
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


interface GameState{
    movPlayerDown:boolean;
    waitingForUpdate:boolean;
    resetGame:boolean;
    waitingForNewPiece: boolean;
}
  
interface GameTimeVariables{
    secondsPerTick:number,
    syncTime: number, // the time we get from the server, and is updated every call to UPDATE
    previousTime: number, //the time we use to determine whether we have passed a secondsPerTick threshhold value
    secondsSinceLastUpdate:number
}

export type{
    UserData,
    Directions,
    ClientInfo,
    Client,
    Block,
    UpdateInfo,
    NewConnectionInfo,
    NetworkInfo,
    GameState,
    GameTimeVariables
}