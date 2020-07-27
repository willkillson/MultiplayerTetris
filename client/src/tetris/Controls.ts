import Mousetrap from 'mousetrap';
import Tetris from './Tetris'
import * as MyConstants from './utilities/constants'
import { Vector3, Object3D } from 'three';
import * as THREE from 'three';

const initControls = (game:Tetris) =>{

  // assign page buttons

  // Move up
  Mousetrap.bind('w', ()=>{
    let info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'up';
    console.log(info);

    const collision = !game.currentPiece.collision_isBlocked.up;
    
    game.socket.emit('move', JSON.stringify(info));
    
  });

  // @ts-ignore
  window['document'].getElementById('button-up').onclick = function hello() {
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'up';
    console.log(info);

    const collision = !game.currentPiece.collision_isBlocked.up;

    //if (collision) 
      game.socket.emit('move', JSON.stringify(info));
    
  };

  // Move left
  Mousetrap.bind('a', ()=>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'left';
    console.log(info);

    const collision = !game.currentPiece.collision_isBlocked.left;

    //if (collision) 
      game.socket.emit('move', JSON.stringify(info));
    
  });

  // @ts-ignore
  window['document'].getElementById('button-left').onclick = function hello() {
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'left';
    if (!game.currentPiece.collision_isBlocked.left) {
      game.socket.emit('move', JSON.stringify(info));
    }
  };


  // Move down
  Mousetrap.bind('s', ()=>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'down';

    const collision = !game.currentPiece.collision_isBlocked.down;

    //if (collision) 
      game.socket.emit('move', JSON.stringify(info));
    
  });

  // @ts-ignore
  window['document'].getElementById('button-down').onclick = function hello() {
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'down';
    if (!game.currentPiece.collision_isBlocked.down) {
      game.socket.emit('move', JSON.stringify(info));
    }
  };

  // right
  Mousetrap.bind('d', ()=>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'right';

    const collision = !game.currentPiece.collision_isBlocked.right

  //  if(collision) 
      game.socket.emit('move', JSON.stringify(info));
    
  });

  // @ts-ignore
  window['document'].getElementById('button-right').onclick = function hello() {
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'right';
    if (!game.currentPiece.collision_isBlocked.right) {
      game.socket.emit('move', JSON.stringify(info));
    }
  };

  // Rotate CCW
  Mousetrap.bind('j', ()=>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'ccw';

    const collision = !game.currentPiece.collision_isBlocked['ccw'];

   // if(collision) 
      game.socket.emit('move', JSON.stringify(info));
    
  });
  // window['document'].getElementById('button-ccw').onclick = function hello(){
  //   console.log("Not implemented.")
  // }

  // Rotate CW


  Mousetrap.bind('k', ()=>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'cw';

    const collision = !game.currentPiece.collision_isBlocked['cw'];
    if (collision) 
      game.socket.emit('move', JSON.stringify(info));

  });

  // window['document'].getElementById('button-cw').onclick = function hello(){
  //   console.log("Not implemented.")
  // }

  // Move in
  Mousetrap.bind('e', ()=>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'in';

    const collision = !game.currentPiece.collision_isBlocked.in;
    //if (collision) 
      game.socket.emit('move', JSON.stringify(info));

  });
  // window['document'].getElementById('button-in').onclick = function hello(){
  //   let info = {};
  //   info['id'] = props.clientId;
  //   info['dir'] = 'in';
  //   if(!props.currentPiece.collision_isBlocked.in)
  //     props.socket.emit('move',JSON.stringify(info));
  // }


  // MOVE OUT
  Mousetrap.bind('q', ()=>{
    const info = <Message>{};
    info['id'] = game.clientId;
    info['dir'] = 'out';

    const collision = !game.currentPiece.collision_isBlocked.out;
    //if (collision) 
      game.socket.emit('move', JSON.stringify(info));
    
  });
  // window['document'].getElementById('button-out').onclick = function hello(){
  //   let info = {};
  //   info['id'] = props.clientId;
  //   info['dir'] = 'out';
  //   if(!props.currentPiece.collision_isBlocked.out)
  //     props.socket.emit('move',JSON.stringify(info));
  // }


  interface Block{
    position: Vector3,
    piece_type: number,
    uuid: string//unique identifier assigned by the server
  }


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

  Mousetrap.bind('h', ()=>{    
    //console.log(game.currentPiece);
    const info = <Message>{};
    console.log(game);
    info['player'] = game.clientId;
    info['color'] = game.currentPiece.color;
    info['blocks'] = getRotatedBlocksFromMesh(game.currentPiece.mesh);
   
    info['blocks'] = bakeInOrigin(info['blocks'], game.currentPiece.mesh.position);
    console.log("info");
    console.log(info);
    game.socket.emit('set_blocks', info);

    //set the current player to null
    game.currentPiece=null;

    //remove the current players piece from the game, and let the server generate another one

  });

  Mousetrap.bind('i', ()=>{    
    console.log(game.currentPiece);

    for(let i = 0;i< game.currentPiece.mesh.children.length;i++){
      console.log(game.currentPiece.mesh.children[i].position);
    }

    console.log(game.currentPiece.mesh.rotation);


    
  });


  
};

const bakeInOrigin = (blocks:Vector3[], origin:Vector3) =>{
  blocks.forEach((block) =>{
    block.x += origin.x;
    block.y += origin.y;
    block.z += origin.z;
  });
  return blocks;
}

const calRotMatZaxis = (radians:number):THREE.Matrix4 => {
  let m = new THREE.Matrix4();
  m.set(Math.cos(radians),-Math.sin(radians),0,0,
  Math.sin(radians),Math.cos(radians),0,0,
            0,0,1,0,
            0,0,0,1);
  return m;
}

const getRotatedBlocksFromMesh = (mesh:Object3D)=>{

  //we rotate around the z
  let m = calRotMatZaxis(mesh.rotation.z);

  let blocks= [];
  for(let i = 0;i< mesh.children.length;i++){
    let newVec = new Vector3(
      mesh.children[i].position.x,
      mesh.children[i].position.y,
      mesh.children[i].position.z);

    newVec = newVec.applyMatrix4(m);
    

    newVec.x = Math.round(newVec.x*1000)/1000;
    newVec.y = Math.round(newVec.y*1000)/1000;
    newVec.z = Math.round(newVec.z*1000)/1000;
    

    let block = new Vector3(newVec.x,newVec.y,newVec.z);

    blocks.push(block);
  }
 // console.log(blocks);
  return blocks;
}

export default initControls;
