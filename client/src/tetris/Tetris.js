import React, { Component } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//local imports
import Piece from './pieces/piece'
import * as BOARD from './board/board';
import Controls from "./Controls";
import * as NETWORK from './util'

import io from "socket.io-client";


class Tetris extends Component {

  constructor(){
    super();
    //
    this.networkInfo = {};
    this.clientId = null;
    this.socket = null;
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.renderer.setSize( window.innerWidth*0.90, window.innerHeight*0.90 );
    this.renderer.gammaFactor = 2.2;
    
    //camera position
    this.camera.position.y = 10;
    this.camera.position.x = 0;
    this.camera.position.z = 15;

    //default game values
    this.currentPiece = null;

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
    //SETUP NETWORK
    this.socket = io('http://69.254.195.147:80');
    
    this.socket.on('onconnected',(data)=>{
      this.clientId = data.id;
    })

    this.socket.emit('join', 'hello world from client');

    this.socket.on('UPDATE',(info)=>{

      //removes all units that don't exist anymore.
      NETWORK.syncronizeScene(this.scene,info);
      

      this.networkInfo = JSON.parse(info);

      let ootherInfo = JSON.parse(info);
      delete ootherInfo[this.clientId];//remove our data from the list
      let otherInfo = Object.entries(ootherInfo);//convert our json object into an array of arrays without our piece in it.

      //HANDLE OTHER PLAYERS PIECE's
      for(let i = 0;i< otherInfo.length;i++){
        let player = otherInfo[i];
        let playerId = player[0];
        let playersCurrentPiece = player[1];

       
        //check if the piece is already created  in the scene
        let isInTheScene = false;
        let childParent = null;//this is our big object

        this.scene.children.forEach(child=>{
          if(child.name===playerId){
            isInTheScene=true;
            childParent = child;
          }
        })
        


        //use that condition to create the piece
        if(!isInTheScene){
          let otherPiece= Piece( playersCurrentPiece['piece_type']);
          otherPiece.mesh.name = playerId;
          otherPiece.mesh.position.x = playersCurrentPiece.position_x;
          otherPiece.mesh.position.y = playersCurrentPiece.position_y;
          otherPiece.mesh.position.z = playersCurrentPiece.position_z;
          this.scene.add(otherPiece.mesh);
          
        }else{
          //we need to find the piece in the scene, so we can update its position
          childParent.position.x = playersCurrentPiece.position_x;
          childParent.position.y = playersCurrentPiece.position_y;
          childParent.position.z = playersCurrentPiece.position_z;
        }
      }

      //HANDLE OUR CLIENTS PIECE
      let ourNetworkedCurrentPiece = this.networkInfo[this.clientId];//pull out our piece
      if(this.currentPiece===null){
        this.currentPiece = Piece(ourNetworkedCurrentPiece.piece_type);
        this.currentPiece.mesh.name = this.clientId;
        this.scene.add(this.currentPiece.mesh);
      }else{
        this.currentPiece.mesh.position.x = ourNetworkedCurrentPiece.position_x;
        this.currentPiece.mesh.position.y = ourNetworkedCurrentPiece.position_y;
        this.currentPiece.mesh.position.z = ourNetworkedCurrentPiece.position_z;
      }


      //remove all the pieces that are 

      



    })


    //SETUP GAME

    let frame = BOARD.frame();
    frame.position.add(new Vector3(-5,0,0))

    this.scene.add(BOARD.levelFloor());   //grpimd
    this.scene.add(BOARD.sky()); 
    this.scene.add(frame);          
    this.scene.add(new THREE.DirectionalLight(0xfffffff,3.0));
  }

  update(){

    if(this.currentPiece!==null){
      this.currentPiece.update();
    }


  }

  draw(){

  }

  render() {
    return (
      <div>
        
        <h7>Controls: w,a,s,d,e,q</h7>
        <h7>  Collisions - Yes</h7>
        <h7>  Rotations - No</h7>
        <div ref={ref => (this.mount = ref)} />
      </div>
    )
  }

}

export default Tetris;
