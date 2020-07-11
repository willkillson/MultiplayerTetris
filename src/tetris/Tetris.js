import React, { Component } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//local imports
import Piece from './pieces/piece'
import * as BOARD from './board/board';
import Controls from "./Controls";


class Tetris extends Component {

  constructor(){
    super();

    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer.setSize( window.innerWidth*0.75, window.innerHeight*0.75 );
    this.renderer.gammaFactor = 2.2;
    
    //camera position
    this.camera.position.y = 8.5;
    this.camera.position.x = 0.15;
    this.camera.position.z = 15;

    //controls
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


    let piece1 = Piece();   
    let piece3 = Piece();   
    this.scene.add(piece3.mesh);         
    this.scene.add(piece1.mesh);     

    piece1.moveIn();
    piece1.moveIn();
    piece1.rotateCCW(Math.PI/2);
    piece1.rotateCCW(Math.PI/2);
    piece1.moveUp();


    piece3.moveIn();
    piece3.moveIn();
    piece3.moveDown();


    this.currentPiece = Piece(2);

    this.scene.add(this.currentPiece.mesh);
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
        <div ref={ref => (this.mount = ref)} />
      </div>
    )
  }

}

export default Tetris;
