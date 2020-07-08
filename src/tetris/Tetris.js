import React, { Component } from "react";

import Mousetrap from 'mousetrap';

import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


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
    this.initControls();

    


  }

  


  
  componentDidMount() {
    this.mount.appendChild( this.renderer.domElement ); //must be located in the componentDidMount()
    this.controls = new OrbitControls (this.camera, this.renderer.domElement);

    this.init();


//attributes are per vertex

    const vertexShader = 
"attribute float vertexDisplacement;"+
    "uniform float delta;"+
    "varying float vOpacity;"+
    "varying vec3 vUv;"+
    
"void main()" +
 "{"+
  "vUv = position;"+
   "vOpacity = vertexDisplacement;"+
    
    "vec3 p = position;"+
    
        "p.x += sin(vertexDisplacement) * 10.0;"+
        "p.y += cos(vertexDisplacement) * 50.0;"+
    
      "vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);"+
      "gl_Position = projectionMatrix * modelViewPosition;"+
    "}";

    const fragmentShader = 
    "uniform float delta;"+
    "varying float vOpacity;"+
    "varying vec3 vUv;"+
    
    "void main() {"+
    
        "float r = 1.0 + cos(vUv.x * delta);"+
        "float g = 0.5 + sin(delta) * 0.1;"+
        "float b = 0.5 + cos(delta) * 0.1;"+
        "vec3 rgb = vec3(r, g, b);"+
    
      "gl_FragColor = vec4(rgb, vOpacity);"+
    "}";

    var customUniforms = {
      delta: {value: 0}
  };
    var material = new THREE.ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });
    var geometry = new THREE.BoxBufferGeometry(100, 100, 100, 10, 10, 10);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -1000;
    mesh.position.x = -100;



    var geometry2 = new THREE.SphereGeometry(50, 20, 20);
    var mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.z = -1000;



    var geometry3 = new THREE.PlaneGeometry(10000, 10000, 100, 100);
    var mesh3 = new THREE.Mesh(geometry3, material);
    mesh3.rotation.x = -90 * Math.PI / 180;
    mesh3.position.y = -100;
    this.scene.add(mesh3);


    //attribute
    var vertexDisplacement = new Float32Array(geometry.attributes.position.count);

    for (var i = 0; i < vertexDisplacement.length; i ++) {
        vertexDisplacement[i] = Math.sin(i);
    }

    geometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));



    let delta = 0;
    const animate = () => {
      this.currentPiece.update();

      delta += 0.1;
        //uniform
      mesh.material.uniforms.delta.value = 0.5 + Math.sin(delta) * 0.5;

      //attribute
      for (var i = 0; i < vertexDisplacement.length; i ++) {
          vertexDisplacement[i] = 0.5 + Math.sin(i + delta) * 0.25;
      }
      mesh.geometry.attributes.vertexDisplacement.needsUpdate = true;
    
      this.renderer.render( this.scene, this.camera );
      requestAnimationFrame( animate );
    };

    animate();
  }

  init(){
    
    this.currentPiece = Piece(Math.floor(Math.random()*6));
    this.scene.add(this.currentPiece.mesh);
    let frame = BOARD.frame();
    frame.position.add(new Vector3(-5,0,0))

    this.scene.add(BOARD.levelFloor());   //grpimd
    this.scene.add(BOARD.sky()); 
    this.scene.add(frame);          
    this.scene.add(new THREE.DirectionalLight(0xfffffff,3.0));
  }

  initControls(){

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

    Mousetrap.bind('j',()=>{
      this.currentPiece.rotate(-Math.PI/2);
    })

    Mousetrap.bind('k',()=>{
      this.currentPiece.rotate(Math.PI/2);
    })

    Mousetrap.bind('h',()=>{
      this.currentPiece = Piece(Math.floor(Math.random()*6));
      this.scene.add(this.currentPiece.mesh);
    })

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
