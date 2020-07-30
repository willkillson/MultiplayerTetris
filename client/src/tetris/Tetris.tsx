import * as React from 'react';
import * as ReactDOM from "react-dom";

import * as THREE from 'three';
import {Vector3, Quaternion, Matrix4} from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import io from 'socket.io-client';

// local imports
import * as PIECE from './Entities/piece';
import * as BOARD from './Entities/board';
import * as NETWORK from './Network';

import * as CONTROLMANAGER from './Controls/ControlManager';
import * as CONTROLS from './Controls/Controls';




interface GameState{
  movPlayerDown
}

interface GameTimeVariables{
  secondsPerTick:number,
  syncTime: number, // the time we get from the server, and is updated every call to UPDATE
  previousTime: number, //the time we use to determine whether we have passed a secondsPerTick threshhold value
  secondsSinceLastUpdate:number
}

class Tetris extends React.Component {
  
  //Tetris
  currentPiece: PIECE.Piece;
  gameState: GameState;
  gameTimeVariables: GameTimeVariables;

  //Engine
  IS_DEVELOP: boolean;
  controls: CONTROLS.Controls;
  controlManager: CONTROLMANAGER.ControlManager;
  
  ////Networking
  clientId: string|null;
  socket: any;

  ////Graphics
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;

  constructor(props) {
    super(props);

    this.IS_DEVELOP = true;// MAKE SURE TO SET THIS TO FALSE WHEN PUSHING TO MASTER FOR A NEW BUILD

    this.clientId = null;
    this.socket = null;
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );

    this.camera.rotateOnAxis(new Vector3(1, 0, 0), 0);

    this.renderer.gammaFactor = 2.2;
 
    // camera position
    this.camera.position.y = 10;
    this.camera.position.x = 0;
    this.camera.position.z = 15;

    // default game values
    this.currentPiece = null;
 
    this.gameState ={
      movPlayerDown:false//when true, the game will force the player to move down
    }

    //gameTime
    this.gameTimeVariables={
      secondsPerTick: 1,
      syncTime: 0,
      previousTime: 0,
      secondsSinceLastUpdate: 0
    }

  }

  /**
   * Initialize network, and game state.
   */
  init() {
    // SETUP NETWORK

    if (this.IS_DEVELOP) {
      this.socket = io('localhost:80');
    } else {
      this.socket = io('ec2-13-56-213-252.us-west-1.compute.amazonaws.com:80');
    }

    this.socket.on('onconnected', (newClient)=> NETWORK.onConnected(newClient,this));

    this.socket.on('onPlayerDisconnect', (info)=> NETWORK.onPlayerDisconnect(info,this));

    this.socket.on('onNewPlayer', (info) => NETWORK.onNewPlayer(info,this));

    this.socket.on('UPDATE', (info)=> NETWORK.onUpdate(info,this));

    this.socket.on('onPlayerSetPiece', (info)=> NETWORK.onPlayerSetPiece(info,this));

    this.socket.on('updateAllPlayers', (info)=> NETWORK.updateAllPlayers(info,this));

    // allows the player to move again.
    this.socket.on('aknowledgeMove', ()=> {
      this.controlManager.freeUpControls()

    });

    //setup the game
    this.setupGame();

  }

  setupGame(){

    // SETUP GAME
    const frame = BOARD.frame();
    frame.position.add(new Vector3(-5, 0, 0));
    this.scene.add(BOARD.levelFloor()); // grpimd
    this.scene.add(BOARD.sky());
    this.scene.add(frame);
  }

  update(totalTime) {

   
    if (this.currentPiece!==null) {
      this.currentPiece.update(); //update our current piece so we get all the collision
      if(this.gameState.movPlayerDown ===true){
        this.forceDown()
        this.gameState.movPlayerDown=false;
      }else{
        this.controlManager.processCommand();
      }
    }
    
    //changes the game state based on the number of ticks.
    if(this.gameTimeVariables.syncTime%this.gameTimeVariables.secondsPerTick===0){
      this.gameTimeVariables.secondsSinceLastUpdate = this.gameTimeVariables.syncTime - this.gameTimeVariables.previousTime;
      if(this.gameTimeVariables.secondsSinceLastUpdate!==0){
        this.gameTimeVariables.previousTime = this.gameTimeVariables.syncTime;//update the previous time we did this
        this.gameState.movPlayerDown=true;
      }
    }




    //this.gameStep(totalTime);//checks the time
  }

  //Tetris
  forceDown(){


    if(this.currentPiece!==null){
      const info = {};
      if(this.currentPiece.collision_isBlocked.down===true){

        //set the piece
        info['player'] = this.clientId;
        info['color'] = this.currentPiece.color;
        info['blocks'] = getRotatedBlocksFromMesh(this.currentPiece.mesh);
        info['blocks'] = bakeInOrigin(info['blocks'], this.currentPiece.mesh.position);
        this.socket.emit('set_blocks', info);
        this.currentPiece = null;
      }else{
        

        // @ts-ignore
        info.id = this.clientId;

        // @ts-ignore
        info.dir = 'down';

        this.socket.emit('forceDown', JSON.stringify(info));
        //move the piece
      }

    }

  }

  //Tetris
  resetGame(){
    let inActivePieces = this.scene.children.filter((child)=>{
      return child.userData.entityType==='inactive_piece';
    });
    //console.log(inActivePieces);

    inActivePieces.forEach((piece)=>{
      this.scene.remove(piece);
    })
  
  }

  //Engine
  componentDidMount() {
    //CONTROL.default(this);
    this.controlManager = new CONTROLMANAGER.ControlManager(this);
    this.controls = new CONTROLS.Controls(this.controlManager);


    // @ts-ignore
    this.mount.appendChild( this.renderer.domElement ); // must be located in the componentDidMount()
    // this.controls = new OrbitControls (this.camera, this.renderer.domElement);
    this.init();

    // //////////MainGameLoop
    let width = window['document'].getElementById('myCanvas').clientWidth;
    let height = window['document'].getElementById('myCanvas').clientHeight;
    this.renderer.setSize(
        1000,
        640,
    );

    let totalTime = 0;
    const animate = (now) => {
      now = now * 0.001; //change to seconds
      const dt = now - totalTime;
      totalTime = now;

      if (width!==window['document'].getElementById('myCanvas').clientWidth) {
        width = window['document'].getElementById('myCanvas').clientWidth;
        height = window['document'].getElementById('myCanvas').clientWidth*0.5625;
        this.renderer.setSize(
            width,
            height,
        );
      }

      this.update(totalTime);
      this.renderer.render( this.scene, this.camera );
      requestAnimationFrame( animate );
    };
    // @ts-ignore
    animate();
  }

  render() {
    return (
      // @ts-ignore
      <div ref={(ref) => (this.mount = ref)} />
    );
  }
}

const bakeInOrigin = (blocks:Vector3[], origin:Vector3) => {
  blocks.forEach((block) => {
    block.x += origin.x;
    block.y += origin.y;
    block.z += origin.z;
  });
  return blocks;
}

const calRotMatZaxis = (radians:number):THREE.Matrix4 => {
  let m = new THREE.Matrix4();
  m.set(Math.cos(radians),-Math.sin(radians),0,0,
  Math.sin(radians),Math.cos(radians),0,0,
            0,0,1,0,
            0,0,0,1);
  return m;
}

export const getRotatedBlocksFromMesh = (mesh:THREE.Object3D)=>{

  //we rotate around the z
  let m = calRotMatZaxis(mesh.rotation.z);

  let blocks= [];
  for(let i = 0;i< mesh.children.length;i++){
    let newVec = new Vector3(
      mesh.children[i].position.x,
      mesh.children[i].position.y,
      mesh.children[i].position.z);

    newVec = newVec.applyMatrix4(m);
    
    newVec.x = Math.round(newVec.x*1000)/1000;
    newVec.y = Math.round(newVec.y*1000)/1000;
    newVec.z = Math.round(newVec.z*1000)/1000;
    
    let block = new Vector3(newVec.x,newVec.y,newVec.z);

    blocks.push(block);
  }
  return blocks;
}

export default Tetris;
