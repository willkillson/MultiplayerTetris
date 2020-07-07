import React, { Component } from "react";


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


  }

  
  
  componentDidMount() {

    this.mount.appendChild( this.renderer.domElement ); //must be located in the componentDidMount()

    //this.scene.add(...Gizmo());
    //const controls = new OrbitControls(this.camera, this.renderer.domElement);

    let currentPiece = Piece(7);

    //currentPiece.move(new Vector3(0,1,0));dd
    let cube2 = Piece(7);

    cube2.move(new Vector3(0,8,0));

    currentPiece.move(new Vector3(0,5,0));


    this.scene.add(currentPiece.mesh);
    this.scene.add(cube2.mesh);

    this.scene.add(BOARD.levelFloor());   //grpimd
    this.scene.add(BOARD.sky());      

    let frame = BOARD.frame();
    frame.position.add(new Vector3(-5,0,0))
    this.scene.add(frame);          

    this.scene.add(new THREE.DirectionalLight(0xfffffff,3.0));

    //controls.

    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown (event) {
      const xSpeed = 1;
      const ySpeed = 1;
      const keyCode = event.which;
      //w 87
      //a 65
      //s 83
      //d 68
  
      //j 74
      //k 75
  
      //h 72
  
      switch(keyCode){
        case 65://a
          {
            if(!currentPiece.collision_isBlocked['left']){
              currentPiece.move(new Vector3(-xSpeed, 0,0));
            }
            break;
          }
        case 68://d
          {
            if(!currentPiece.collision_isBlocked['right']){
              currentPiece.move(new Vector3(xSpeed, 0,0));
            }
            break;
          }
        case 87://w
          {
            if(!currentPiece.collision_isBlocked['up'])
              currentPiece.move(new Vector3(0, ySpeed,0));
            break;
          }
        case 83://s
          {
            if(!currentPiece.collision_isBlocked['down']){
              currentPiece.move(new Vector3(0, -ySpeed,0));
            }
              
            break;
          }
        case 74://j
        
        currentPiece.rotate(new Vector3(0,0,Math.PI/2));
          break;
        case 75://k
        
        currentPiece.rotate(new Vector3(0,0,-1*Math.PI/2));
          break;
        case 72://h temp set into board
          {
            currentPiece = Piece(7);
            this.scene.add(currentPiece.mesh);
            break;
          }

        default:
           break;
      }
    }

    const animate = () => {

      currentPiece.update();
      
      //console.log(this.currentPiece);
      this.renderer.render( this.scene, this.camera );
      requestAnimationFrame( animate );
    };

    animate();
  }




  newPiece(){
    let newPiece = Piece(Math.floor(Math.random()*6));
    newPiece.move(0,15,0);
    this.scene.add(...newPiece.meshs);
    return newPiece;
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
