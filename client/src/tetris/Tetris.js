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
  }

  /**
   * Initialize network, and game state.
   */
  init() {
    // SETUP NETWORK

    if (this.IS_DEVELOP) {
      this.socket = io('localhost:80');
    } else {
      this.socket = io('ec2-52-53-191-238.us-west-1.compute.amazonaws.com:80');
    }

    this.socket.on('onconnected', (newClient)=> NETWORK.onConnected(newClient,this));

    this.socket.on('onPlayerDisconnect', (info)=> NETWORK.onPlayerDisconnect(info,this));

    this.socket.on('onNewPlayer', (info) => NETWORK.onNewPlayer(info,this));

    this.socket.on('UPDATE', (info)=> NETWORK.onUpdate(info,this));

    this.socket.on('onPlayerSetPiece', (info)=> NETWORK.onPlayerSetPiece(info,this));

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
    this.gameStep();//checks the time
  }

  gameStep(){

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
      console.log
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
