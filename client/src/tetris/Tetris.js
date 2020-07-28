import React, {Component} from 'react';
import * as THREE from 'three';
import {Vector3, Quaternion, Matrix4} from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import io from 'socket.io-client';

// local imports
import Piece from './pieces/piece';
import * as BOARD from './board/board';
import Controls from './Controls';
import * as NETWORK from './Network';
import * as CONTROL from './Controls.ts';




class Tetris extends Component {
  constructor(props, ref) {
    super();
    this.IS_DEVELOP = false;// MAKE SURE TO SET THIS TO FALSE WHEN PUSHING TO MASTER FOR A NEW BUILD
    //
    this.networkInfo = {};
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
    this.gameSettings={
      secondsPerTick: 1
    }

    this.syncTime = 0;// the time we get from the server, and is updated every call to UPDATE
    this.previousTime = 0; //the time we use to determine whether we have passed a secondsPerTick threshhold value
    this.secondsSinceLastUpdate = 0;


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
      //update our current piece so we get all the collision
      this.currentPiece.update();
    }
    
    //changes the game state based on the number of ticks.
    if(this.syncTime%this.gameSettings.secondsPerTick===0){
  
      this.secondsSinceLastUpdate = this.syncTime - this.previousTime;

      if(this.secondsSinceLastUpdate!==0){
        this.previousTime = this.syncTime;//update the previous time we did this

        this.gameState.movPlayerDown=true;
        
      }
  
    }

    if(this.gameState.movPlayerDown ===true){
     this.forceDown()
     this.gameState.movPlayerDown=false;
    }


    //this.gameStep(totalTime);//checks the time
  }

  forceDown(){


    if(this.currentPiece!==null){
      const info = {};
      if(this.currentPiece.collision_isBlocked.down===true){

        //set the piece
        info['player'] = this.clientId;
        info['color'] = this.currentPiece.color;
        info['blocks'] = CONTROL.getRotatedBlocksFromMesh(this.currentPiece.mesh);
        info['blocks'] = CONTROL.bakeInOrigin(info['blocks'], this.currentPiece.mesh.position);
        this.socket.emit('set_blocks', info);
        this.currentPiece = null;
      }else{

        info.id = this.clientId;
        info.dir = 'down';
        this.socket.emit('move', JSON.stringify(info));
        //move the piece
      }

    }

  }

  resetGame(){

    //remove all the inactive pieces
    // console.log(" this.scene.childre");
    // console.log( this.scene.children);
    let inActivePieces = this.scene.children.filter((child)=>{
      return child.userData.entityType==='inactive_piece';
    });

    // console.log("inActivePieces");
    // console.log(inActivePieces);

    inActivePieces.forEach((piece)=>{
      this.scene.remove(piece);
    })
  
    // this.scene = new THREE.Scene();
    // this.setupGame();
  }

  componentDidMount() {
    Controls(this);
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

    animate();
  }

  render() {
    return (
      <div>
        <div ref={(ref) => (this.mount = ref)} />
      </div>
    );
  }

}

export default Tetris;
