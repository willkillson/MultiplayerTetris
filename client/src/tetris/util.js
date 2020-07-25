import * as THREE from 'three';
import Piece from './pieces/piece';
import Tetris from './Tetris'



const gizmo = () =>{
  // arrow helper
  const dir1 = new THREE.Vector3( 1, 0, 0 );
  const dir2 = new THREE.Vector3( 0, 1, 0 );
  const dir3 = new THREE.Vector3( 0, 0, 1 );

  // normalize the direction vector (convert to vector of length 1)
  dir1.normalize();
  dir2.normalize();
  dir3.normalize();

  const origin = new THREE.Vector3( 5, 5, 5 );
  const length = 5;

  const hex1 = 0xff0000;
  const hex2 = 0x00ff00;
  const hex3 = 0x0000ff;

  const arrowHelper1 = new THREE.ArrowHelper( dir1, origin, length, hex1 );
  const arrowHelper2 = new THREE.ArrowHelper( dir2, origin, length, hex2 );
  const arrowHelper3 = new THREE.ArrowHelper( dir3, origin, length, hex3 );

  const ret = [];
  ret.push(arrowHelper1);
  ret.push(arrowHelper2);
  ret.push(arrowHelper3);

  return ret;
};

const getChildByName = (parent, childName) => {
  parent.children.forEach((child) => {
    if (child.name===childName) {
      return child;
    }
  });
  return null;
};

/**
 * This method removes players pieces that are
 * no longer connected. This method is a prime
 * candidate for refactoring into "handleOtherPlayersPieces"
 *
 * @param {*} props "this" information.
 * @param {*} networkInfo the network information
 * provided on the call to'UPDATE'
 */
const syncronizeScene = (props, networkInfo) =>{

  let ni = JSON.parse(networkInfo);

  const scene = props.scene;

  const clientUnits = [];
  scene.children.forEach((child)=>{
    if (child.name!=='') {
      clientUnits.push(child);
    }
  });

  const serverUnits = Object.keys(ni['users']);
  for (let i = 0; i< clientUnits.length; i++) {
    let contains = false;
    for (let j = 0; j< serverUnits.length; j++) {
      if (clientUnits[i].name===serverUnits[j]) {
        contains = true;
      }
    }
    if (contains===false) {
      const child = scene.getObjectByName(clientUnits[i].name);
      scene.remove(child);
    }
  }
};





export {
  syncronizeScene,
  getChildByName,
  gizmo,
  handleOtherPlayersPieces,
  handlePlayersPiece,
};
