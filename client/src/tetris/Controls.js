import Mousetrap from 'mousetrap';
import Piece from './pieces/piece'

const initControls = (props) =>{


    //assign page buttons



    
    //Move up
    Mousetrap.bind('w',()=>{
      let info = {};
      info['id'] = props.clientId;
      info['dir'] = 'up';
      if(!props.currentPiece.collision_isBlocked.up){
        props.socket.emit('move',JSON.stringify(info));
      }
      
    })
    window['document'].getElementById('button-up').onclick = function hello(){
      let info = {};
      info['id'] = props.clientId;
      info['dir'] = 'up';
      if(!props.currentPiece.collision_isBlocked.up){
        props.socket.emit('move',JSON.stringify(info));
      }
    }

    //Move left
    Mousetrap.bind('a',()=>{
      let info = {};
      info['id'] = props.clientId;
      info['dir'] = 'left';
      if(!props.currentPiece.collision_isBlocked.left)
        props.socket.emit('move',JSON.stringify(info));
    })
    window['document'].getElementById('button-left').onclick = function hello(){
      let info = {};
      info['id'] = props.clientId;
      info['dir'] = 'left';
      if(!props.currentPiece.collision_isBlocked.left)
        props.socket.emit('move',JSON.stringify(info));
    }


    //Move down
    Mousetrap.bind('s',()=>{
      let info = {};
      info['id'] = props.clientId;
      info['dir'] = 'down';
      if(!props.currentPiece.collision_isBlocked.down)
        props.socket.emit('move',JSON.stringify(info));
    })
    window['document'].getElementById('button-down').onclick = function hello(){
      let info = {};
      info['id'] = props.clientId;
      info['dir'] = 'down';
      if(!props.currentPiece.collision_isBlocked.down)
        props.socket.emit('move',JSON.stringify(info));
    }

      //right
      Mousetrap.bind('d',()=>{
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'right';
        if(!props.currentPiece.collision_isBlocked.right)
          props.socket.emit('move',JSON.stringify(info));
      })
      window['document'].getElementById('button-right').onclick = function hello(){
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'right';
        if(!props.currentPiece.collision_isBlocked.right)
          props.socket.emit('move',JSON.stringify(info));
      }

      //Rotate CCW
      Mousetrap.bind('j',()=>{
        console.log("Not implemented.")
      })
      window['document'].getElementById('button-ccw').onclick = function hello(){
        console.log("Not implemented.")
      }

      //Rotate CW
      Mousetrap.bind('k',()=>{
        console.log("Not implemented.")
      })
      window['document'].getElementById('button-cw').onclick = function hello(){
        console.log("Not implemented.")
      }

      //Move in
      Mousetrap.bind('e',()=>{
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'in';
        if(!props.currentPiece.collision_isBlocked.in)
          props.socket.emit('move',JSON.stringify(info));
      })
      window['document'].getElementById('button-in').onclick = function hello(){
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'in';
        if(!props.currentPiece.collision_isBlocked.in)
          props.socket.emit('move',JSON.stringify(info));
      }


      //MOVE OUT
      Mousetrap.bind('q',()=>{
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'out';
        if(!props.currentPiece.collision_isBlocked.out)
          props.socket.emit('move',JSON.stringify(info));
      })
      window['document'].getElementById('button-out').onclick = function hello(){
        let info = {};
        info['id'] = props.clientId;
        info['dir'] = 'out';
        if(!props.currentPiece.collision_isBlocked.out)
          props.socket.emit('move',JSON.stringify(info));
      }

  
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