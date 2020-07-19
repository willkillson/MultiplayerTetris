import Mousetrap from 'mousetrap';
import Piece from './pieces/piece'

const initControls = (props) =>{
    
    Mousetrap.bind('w',()=>{
        //props.currentPiece.instantDrop();
        //props.currentPiece.moveUp();

        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'up';
        if(!props.currentPiece.collision_isBlocked.up){
          props.socket.emit('move',JSON.stringify(info));
        }
        
      })
      Mousetrap.bind('a',()=>{
        //props.currentPiece.moveLeft();
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'left';
        if(!props.currentPiece.collision_isBlocked.left)
          props.socket.emit('move',JSON.stringify(info));
      })
      Mousetrap.bind('s',()=>{
        //props.currentPiece.moveDown();
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'down';
        if(!props.currentPiece.collision_isBlocked.down)
          props.socket.emit('move',JSON.stringify(info));
      })
      Mousetrap.bind('d',()=>{
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'right';
        if(!props.currentPiece.collision_isBlocked.right)
          props.socket.emit('move',JSON.stringify(info));
        //props.currentPiece.moveRight();
      })
  
      Mousetrap.bind('j',()=>{
        //props.currentPiece.rotateCCW();
      })

      Mousetrap.bind('e',()=>{
        //props.currentPiece.moveIn();
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'in';
        if(!props.currentPiece.collision_isBlocked.in)
          props.socket.emit('move',JSON.stringify(info));
      })

      Mousetrap.bind('q',()=>{
        //props.currentPiece.moveOut();
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'out';
        if(!props.currentPiece.collision_isBlocked.out)
          props.socket.emit('move',JSON.stringify(info));
      })
  
      Mousetrap.bind('k',()=>{
        //props.currentPiece.rotateCW();
      })
  
      Mousetrap.bind('h',()=>{
        //props.currentPiece = Piece(Math.floor(Math.random()*7));
        //props.scene.add(props.currentPiece.mesh);

        props.socket.emit('say', props.clientId);


      })
}

export default initControls;