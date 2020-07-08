import React, { Component } from "react";

import Mousetrap from 'mousetrap';

import * as THREE from "three";
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Vector3 } from "three";


//local imports

import Piece from './pieces/piece'
import * as BOARD from './board/board';


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

    Mousetrap.bind('w',()=>{
      this.currentPiece.instantDrop();
    })
    Mousetrap.bind('a',()=>{
      this.currentPiece.moveLeft();
    })
    Mousetrap.bind('s',()=>{
      this.currentPiece.moveDown();
    })
    Mousetrap.bind('d',()=>{
      this.currentPiece.moveRight();
    })
    Mousetrap.bind('h',()=>{
      this.currentPiece = Piece(7);
      this.scene.add(this.currentPiece.mesh);
    })



  }


  
  componentDidMount() {
    this.mount.appendChild( this.renderer.domElement ); //must be located in the componentDidMount()


    this.init();
    const animate = () => {
      this.currentPiece.update();
    

    
      this.renderer.render( this.scene, this.camera );
      requestAnimationFrame( animate );
    };

    animate();
  }

  init(){
    this.currentPiece = Piece(5);
    this.scene.add(this.currentPiece.mesh);
    let frame = BOARD.frame();
    frame.position.add(new Vector3(-5,0,0))

    this.scene.add(BOARD.levelFloor());   //grpimd
    this.scene.add(BOARD.sky()); 
    this.scene.add(frame);          
    this.scene.add(new THREE.DirectionalLight(0xfffffff,3.0));
  }

  render() {
    return (
      <div>
        <h1>HelloWorld!</h1>
        <div ref={ref => (this.mount = ref)} />
      </div>
    )
  }

}

export default Tetris;
