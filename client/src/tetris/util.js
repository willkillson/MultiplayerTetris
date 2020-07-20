import * as THREE from 'three';
import Piece from './pieces/piece';

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
  const scene = props.scene;

  const clientUnits = [];
  scene.children.forEach((child)=>{
    if (child.name!=='') {
      clientUnits.push(child);
    }
  });

  const serverUnits = Object.keys(JSON.parse(networkInfo));
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

/**
 * Updates our players position in the board from the network
 * information.
 *
 * @param {*} props "this" information.
 * @param {*} networkInfo the network information provided on
 * the call to 'UPDATE'
 */
const handlePlayersPiece = (props, networkInfo) =>{
  // HANDLE OUR CLIENTS PIECE
  let ourNetworkedCurrentPiece = JSON.parse(networkInfo);// pull out our piece
  ourNetworkedCurrentPiece = ourNetworkedCurrentPiece[props.clientId];

  if (props.currentPiece===null) {
    props.currentPiece = Piece(ourNetworkedCurrentPiece.piece_type);
    props.currentPiece.mesh.name = props.clientId;
    props.scene.add(props.currentPiece.mesh);
    console.log(props.currentPiece);
  } else {
    // set the position
    // console.log(ourNetworkedCurrentPiece);
    props.currentPiece.mesh.position.x = ourNetworkedCurrentPiece.position_x;
    props.currentPiece.mesh.position.y = ourNetworkedCurrentPiece.position_y;
    props.currentPiece.mesh.position.z = ourNetworkedCurrentPiece.position_z;

    // set the rotation
    // console.log(ourNetworkedCurrentPiece);
    props.currentPiece.mesh.rotation.x = ourNetworkedCurrentPiece.rotation.x;
    props.currentPiece.mesh.rotation.y = ourNetworkedCurrentPiece.rotation.y;
    props.currentPiece.mesh.rotation.z = ourNetworkedCurrentPiece.rotation.z;
    // console.log(props.currentPiece.mesh.rotation);
  }
};

/**
 * Updates the other players positions in the game from the network information.
 *
 * @param {*} props "this" information.
 * @param {*} networkInfo  the network information provided on the call to 'UPDATE'
 */
const handleOtherPlayersPieces = (props, networkInfo) =>{
  const otherPlayersNetworkInformation = JSON.parse(networkInfo);
  delete otherPlayersNetworkInformation[props.clientId];
  const otherInfo = Object.entries(otherPlayersNetworkInformation);

  // HANDLE OTHER PLAYERS PIECE's
  for (let i = 0; i< otherInfo.length; i++) {
    const player = otherInfo[i];
    const playerId = player[0];
    const playersCurrentPiece = player[1];

    // check if the piece is already created  in the scene
    let isInTheScene = false;
    let childParent = null;// this is our big object

    props.scene.children.forEach((child)=>{
      if (child.name===playerId) {
        isInTheScene=true;
        childParent = child;
      }
    });

    // use that condition to create the piece
    if (!isInTheScene) {
      const otherPiece= Piece( playersCurrentPiece['piece_type']);
      otherPiece.mesh.name = playerId;
      otherPiece.mesh.position.x = playersCurrentPiece.position_x;
      otherPiece.mesh.position.y = playersCurrentPiece.position_y;
      otherPiece.mesh.position.z = playersCurrentPiece.position_z;
      props.scene.add(otherPiece.mesh);
    } else {
      // we need to find the piece in the scene, so we can update its position
      childParent.position.x = playersCurrentPiece.position_x;
      childParent.position.y = playersCurrentPiece.position_y;
      childParent.position.z = playersCurrentPiece.position_z;
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
