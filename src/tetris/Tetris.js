import React, { Component } from "react";
import ReactDOM from "react-dom";

import * as THREE from "three";

import PieceFactory from './pieces/piece-factory';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const zMax = 30;
//
class Tetris extends Component {
  componentDidMount() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild( renderer.domElement );


    


    
    // console.log(piece.meshs);

    // scene.add( ...piece.meshs);

    let currentCamera = 20;
    let zoom = false;
    
    camera.position.z = currentCamera;

    let pieces = [];

    for(let i = 0;i<10;i++){
      pieces.push(PieceFactory('T'));
      pieces.push(PieceFactory('S'));
      pieces.push(PieceFactory('I'));
      pieces.push(PieceFactory('L'));
      pieces.push(PieceFactory('J'));
      pieces.push(PieceFactory('Z'));
      pieces.push(PieceFactory('O'));
    }


    console.log(pieces);
    pieces.forEach((piece)=>{
      scene.add(...piece.meshs);
    })
    

    const animate = function () {
      requestAnimationFrame( animate );

      pieces.forEach((piece)=>{
        piece.update();
      })

      if(zoom){
        currentCamera += -0.1;
            
        camera.position.z = currentCamera;
        console.log("zooming");
      }
      else{
        currentCamera += 0.1;
        camera.position.z = currentCamera;
        console.log("not zooming");
      }

      if(currentCamera>zMax){
        zoom= true;
      }
      if(currentCamera<10){
        zoom = false;
      }
    
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
