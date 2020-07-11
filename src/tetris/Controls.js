import Mousetrap from 'mousetrap';
import Piece from './pieces/piece'

const initControls = (props) =>{

    Mousetrap.bind('w',()=>{
        //this.currentPiece.instantDrop();
        props.currentPiece.moveUp();
      })
      Mousetrap.bind('a',()=>{
        props.currentPiece.moveLeft();
      })
      Mousetrap.bind('s',()=>{
        props.currentPiece.moveDown();
      })
      Mousetrap.bind('d',()=>{
        props.currentPiece.moveRight();
      })
  
      Mousetrap.bind('j',()=>{
        props.currentPiece.rotateCCW();
      })

      Mousetrap.bind('e',()=>{
        props.currentPiece.moveIn();
      })

      Mousetrap.bind('q',()=>{
        props.currentPiece.moveOut();
      })
  
      Mousetrap.bind('k',()=>{
        
        props.currentPiece.rotateCW();
      })
  
      Mousetrap.bind('h',()=>{
        props.currentPiece = Piece(8);
        props.scene.add(props.currentPiece.mesh);
      })
}

export default initControls;