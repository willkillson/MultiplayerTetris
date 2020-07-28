import Mousetrap from 'mousetrap';
import Tetris from './Tetris'
import * as MyConstants from './utilities/constants'
import { Vector3, Object3D } from 'three';
import * as THREE from 'three';
import * as NETWORK from './Network'

const initControls = (game:Tetris) =>{

  ////////////KEYBOARD
  // Move left
  Mousetrap.bind('a', ()=>{
    NETWORK.sendCommand('left', game);
  });
  // Move down
  Mousetrap.bind('s', ()=>{
    NETWORK.sendCommand('down',game);
  });
  // right
  Mousetrap.bind('d', ()=>{
    NETWORK.sendCommand('right',game);
  });
  // Rotate CW
  Mousetrap.bind('k', ()=>{
    NETWORK.sendCommand('cw',game);
  });
  // Rotate CCW
  Mousetrap.bind('j', ()=>{
    NETWORK.sendCommand('ccw',game);
  });
  // DEBUG
  Mousetrap.bind('i', ()=>{    
    for(let i = 0;i< game.currentPiece.mesh.children.length;i++){
      console.log(game.currentPiece.mesh.children[i].position);
    }
    console.log(game.currentPiece.mesh.rotation);
  });

  ////////////OnScreen
  // @ts-ignore
  window['document'].getElementById('button-left').onclick = () => {
    NETWORK.sendCommand('left', game);
  };
  // @ts-ignore
  window['document'].getElementById('button-down').onclick = () => {
    NETWORK.sendCommand('down',game);
  };
  // @ts-ignore
  window['document'].getElementById('button-right').onclick = () => {
    NETWORK.sendCommand('right',game);
  };

  interface Message{
    origin: Vector3,
    player:string,
    id:string,
    dir:string,
    color:string,
    positions: Vector3[],
    piece_type: number,
    blocks: Vector3[]
  }


  
};

export default initControls;
