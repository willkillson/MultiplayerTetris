
//NodeImports
import * as React from 'react';
import * as ReactDOM from "react-dom";

//LocalImports
import * as GRAPHICS from './Graphics/Graphics';
import * as NETWORK from './Network/ClientNetwork'

import * as CONTROLMANAGER from './Controls/ControlManager';
import * as KEYBOARDCONTROLS from './Controls/KeyboardControls';
import * as ONSCREENCONTROLS from './Controls/OnscreenControls';

import * as GAME from './Game/Game'


export class Engine extends React.Component {
  
  IS_DEVELOP: boolean;
  
  graphics:GRAPHICS.Graphics;
  network: NETWORK.ClientNetwork;
  game:GAME.Game;
  controlManager: CONTROLMANAGER.ControlManager;
  keyboardControls: KEYBOARDCONTROLS.KeyboardControls;
  onscreenControls: ONSCREENCONTROLS.OnscreenControls;

  componentDidMount() {

    // MAKE SURE TO SET THIS TO FALSE WHEN PUSHING TO MASTER FOR A NEW BUILD
    const IS_DEVELOP = true;
    ////GRAPICS
    ////////////////////
    this.graphics = new GRAPHICS.Graphics();
    ////GAME
    ////////////////////
    this.game = new GAME.Game();
    ////NETWORK
    ////////////////////
    this.network = new NETWORK.ClientNetwork(IS_DEVELOP, this.game);
    ////CONTROLS
    ////////////////////
    this.controlManager = new CONTROLMANAGER.ControlManager(this.game);
    this.keyboardControls = new KEYBOARDCONTROLS.KeyboardControls(this.controlManager);
    this.onscreenControls = new ONSCREENCONTROLS.OnscreenControls(this.controlManager);  

    // @ts-ignore
    this.mount.appendChild( this.graphics.renderer.domElement ); // must be located in the componentDidMount()

    this.graphics.init(this.game,
      this.controlManager,
      this.network);
          
    ////StartMainGameLoop
    ////////////////////
    this.graphics.start();
    


  }

  render() {
    return (
      // @ts-ignore
      <div ref={(ref) => (this.mount = ref)} />
    );
  }
  
}

export default Engine;
