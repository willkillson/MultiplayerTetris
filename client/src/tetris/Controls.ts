import Mousetrap from 'mousetrap';
import Tetris from './Tetris'
import * as MyConstants from './utilities/constants'
import { Vector3 } from 'three';

const initControls = (game:Tetris) =>{
  // assign page buttons


  interface Vec3{
    x: number,
    y: number,
    z: number
  }


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
    position: Vec3,
    piece_type: number,
    uuid: string//unique identifier assigned by the server
  }


  interface Message{
    player:string,
    id:string,
    dir:string,
    color:string,
    positions: Vec3[],
    piece_type: number,
    blocks: Vec3[]
  }

  Mousetrap.bind('h', ()=>{
    
    
    //console.log(game.currentPiece);
    const info = <Message>{};
    info['player'] = game.clientId;
    info['color'] = '0xff0000';
    info['blocks'] = getBlocksFromMesh(game.currentPiece.mesh);
    console.log(info);
    game.socket.emit('set_blocks', info);
  });
};

const getBlocksFromMesh = (mesh:any)=>{

  let blocks= [];
  for(let i = 0;i< mesh.children.length;i++){
    let block = new Vector3(
      mesh.children[i].position.x,
      mesh.children[i].position.y,
      mesh.children[i].position.z);
    blocks.push(block);
  }
  return blocks;
}

export default initControls;
