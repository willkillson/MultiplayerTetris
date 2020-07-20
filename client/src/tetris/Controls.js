import Mousetrap from 'mousetrap';

const initControls = (props) =>{
  // assign page buttons


  // Move up
  Mousetrap.bind('w', ()=>{
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'up';
    if (!props.currentPiece.collision_isBlocked.up) {
      props.socket.emit('move', JSON.stringify(info));
    }
  });
  window['document'].getElementById('button-up').onclick = function hello() {
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'up';
    if (!props.currentPiece.collision_isBlocked.up) {
      props.socket.emit('move', JSON.stringify(info));
    }
  };

  // Move left
  Mousetrap.bind('a', ()=>{
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'left';
    if (!props.currentPiece.collision_isBlocked.left) {
      props.socket.emit('move', JSON.stringify(info));
    }
  });
  window['document'].getElementById('button-left').onclick = function hello() {
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'left';
    if (!props.currentPiece.collision_isBlocked.left) {
      props.socket.emit('move', JSON.stringify(info));
    }
  };


  // Move down
  Mousetrap.bind('s', ()=>{
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'down';
    if (!props.currentPiece.collision_isBlocked.down) {
      props.socket.emit('move', JSON.stringify(info));
    }
  });
  window['document'].getElementById('button-down').onclick = function hello() {
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'down';
    if (!props.currentPiece.collision_isBlocked.down) {
      props.socket.emit('move', JSON.stringify(info));
    }
  };

  // right
  Mousetrap.bind('d', ()=>{
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'right';
    if (!props.currentPiece.collision_isBlocked.right) {
      props.socket.emit('move', JSON.stringify(info));
    }
  });
  window['document'].getElementById('button-right').onclick = function hello() {
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'right';
    if (!props.currentPiece.collision_isBlocked.right) {
      props.socket.emit('move', JSON.stringify(info));
    }
  };

  // Rotate CCW
  Mousetrap.bind('j', ()=>{
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'ccw';
    if (!props.currentPiece.collision_isBlocked['ccw']) {
      props.socket.emit('move', JSON.stringify(info));
    }
  });
  // window['document'].getElementById('button-ccw').onclick = function hello(){
  //   console.log("Not implemented.")
  // }

  // Rotate CW


  Mousetrap.bind('k', ()=>{
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'cw';
    if (!props.currentPiece.collision_isBlocked['cw']) {
      props.socket.emit('move', JSON.stringify(info));
    }
  });

  // window['document'].getElementById('button-cw').onclick = function hello(){
  //   console.log("Not implemented.")
  // }

  // Move in
  Mousetrap.bind('e', ()=>{
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'in';
    if (!props.currentPiece.collision_isBlocked.in) {
      props.socket.emit('move', JSON.stringify(info));
    }
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
    const info = {};
    info['id'] = props.clientId;
    info['dir'] = 'out';
    if (!props.currentPiece.collision_isBlocked.out) {
      props.socket.emit('move', JSON.stringify(info));
    }
  });
  // window['document'].getElementById('button-out').onclick = function hello(){
  //   let info = {};
  //   info['id'] = props.clientId;
  //   info['dir'] = 'out';
  //   if(!props.currentPiece.collision_isBlocked.out)
  //     props.socket.emit('move',JSON.stringify(info));
  // }


  Mousetrap.bind('h', ()=>{
    // props.currentPiece = Piece(Math.floor(Math.random()*7));
    // props.scene.add(props.currentPiece.mesh);

    props.socket.emit('say', props.clientId);
  });
};

export default initControls;
