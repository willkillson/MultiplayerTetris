import React, { Component } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//local imports
import Piece from './pieces/piece'
import * as BOARD from './board/board';
import Controls from "./Controls";
import { Quaternion } from "three/build/three.module";

import io from "socket.io-client";
let socket = io('http://localhost:80');

socket.emit('join', 'hello world from client');

class Tetris extends Component {

  constructor(){
    super();

    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer.setSize( window.innerWidth*0.90, window.innerHeight*0.90 );
    this.renderer.gammaFactor = 2.2;
    
    //camera position
    this.camera.position.y = 10;
    this.camera.position.x = 0;
    this.camera.position.z = 15;

    Controls(this);
  }

  componentDidMount() {
    this.mount.appendChild( this.renderer.domElement ); //must be located in the componentDidMount()
    this.controls = new OrbitControls (this.camera, this.renderer.domElement);

    this.init();

    ////////////MainGameLoop
    const animate = () => {

      this.update();

      this.draw();

      this.renderer.render( this.scene, this.camera );
      requestAnimationFrame( animate );
    };

    animate();
  }

  init(){


    let piece1 = Piece(9, new THREE.Vector3(0,5,0));   //single cube
    this.currentPiece =  Piece(2, new THREE.Vector3(0,6,0));   //I piece

    
    this.scene.add(this.currentPiece.mesh);         
    this.scene.add(piece1.mesh);     


    let frame = BOARD.frame();
    frame.position.add(new Vector3(-5,0,0))

    this.scene.add(BOARD.levelFloor());   //grpimd
    this.scene.add(BOARD.sky()); 
    this.scene.add(frame);          
    this.scene.add(new THREE.DirectionalLight(0xfffffff,3.0));
  }

  update(){

    this.currentPiece.update();

  }

  draw(){

  }

  render() {
    return (
      <div>
        <h5>Controls: w,a,s,d,q,e,j,h</h5>
        <div ref={ref => (this.mount = ref)} />
      </div>
    )
  }

}

export default Tetris;
