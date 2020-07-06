import React, { Component } from "react";
import ReactDOM from "react-dom";

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AmbientLight, Vector3 } from "three";


//local imports

import PieceFactory from './pieces/piece-factory';
import Gizmo from './util';
import gizmo from "./util";
import GrassCube from './board/board';




const zMax = 30;
//
class Tetris extends Component {

  constructor(){
    super();

    

    
  }
  
  componentDidMount() {




    let renderer = new THREE.WebGLRenderer();
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


    console.log(Gizmo());
    scene.add(...Gizmo());
    renderer.setSize( window.innerWidth*0.75, window.innerHeight*0.75 );
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;


    //scene.add( arrowHelper );

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild( renderer.domElement );


    const controls = new OrbitControls(camera, renderer.domElement);
    

    let piece = PieceFactory();
    
    // console.log(piece.meshs);

    // scene.add( ...piece.meshs);
    
    camera.position.y = 8.5;
    camera.position.x = 0.15;
    camera.position.z = 15;
    scene.add(...piece.meshs);


    const light = new THREE.DirectionalLight(0xfffffff,3.0);
    scene.add(light);
    

    scene.add( ...GrassCube());



    //controls.
    const xSpeed = 1;
    const ySpeed = 1;
    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event){
      const keyCode = event.which;
      //w 87
      //a 65
      //s 83
      //d 68
  
      //j 74
      //k 75

      //h 72
  
      if(keyCode===83){
        piece.move(0, -ySpeed,0);
      }
      switch(keyCode){
        case 65://a
          piece.move(-xSpeed, 0,0);
          break;
        case 68://d
          piece.move(xSpeed, 0,0);
          break;
        case 87://w
          piece.move(0, ySpeed,0);
          break;
        case 83://s
          piece.move(0, -ySpeed,0);
          break;
        case 74://j
          piece.rotate(0,0,Math.PI/2);
          break;
        case 75://k
        piece.rotate(0,0,-1*Math.PI/2);
          break;
        case 72://h temp set into board
          piece = newPiece();
          break;
      }
    }




    function newPiece(){
      let newPiece = PieceFactory(Math.floor(Math.random()*6));
      scene.add(...newPiece.meshs);
    
      return newPiece;
    }

    const animate = function () {
      requestAnimationFrame( animate );

      console.log("camera x pos = " + camera.position.x);
      console.log("camera y pos = " + camera.position.y);
      console.log("camera z pos = " + camera.position.z);
      // required if controls.enableDamping or controls.autoRotate are set to true
      //controls.update();
    
      renderer.render( scene, camera );
    };
    animate();


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
