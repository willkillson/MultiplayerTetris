
//NodeImports
import * as React from 'react';
import * as ReactDOM from "react-dom";

//LocalImports
import * as GRAPHICS from './Graphics/Graphics';
import * as NETWORK from './Network/ClientNetwork'

import * as CONTROLMANAGER from './Controls/ControlManager';
import * as KEYBOARDCONTROLS from './Controls/KeyboardControls';
import * as ONSCREENCONTROLS from './Controls/OnscreenControls';

import * as GAME from '../common-game/Game'


export class Engine extends React.Component {
  
  private IS_DEVELOP: boolean;

  public network: NETWORK.ClientNetwork;
  public game:GAME.Game;
  public localCommandManager: CONTROLMANAGER.ControlManager;
  public networkCommandManager: CONTROLMANAGER.ControlManager;
  
  private graphics:GRAPHICS.Graphics;
  private keyboardControls: KEYBOARDCONTROLS.KeyboardControls;
  private onscreenControls: ONSCREENCONTROLS.OnscreenControls;

  componentDidMount() {

    // MAKE SURE TO SET THIS TO FALSE WHEN PUSHING TO MASTER FOR A NEW BUILD
    const IS_DEVELOP = true;
    ////GRAPICS
    ////////////////////
    this.graphics = new GRAPHICS.Graphics(this);
    ////GAME
    ////////////////////
    const isClient = true;
    this.game = new GAME.Game();
    ////NETWORK
    ////////////////////
    this.network = new NETWORK.ClientNetwork(IS_DEVELOP, this);
    ////CONTROLS
    ////////////////////    
    this.localCommandManager = new CONTROLMANAGER.ControlManager(this);
    this.networkCommandManager = new CONTROLMANAGER.ControlManager(this);
    this.keyboardControls = new KEYBOARDCONTROLS.KeyboardControls(this.localCommandManager);
    this.onscreenControls = new ONSCREENCONTROLS.OnscreenControls(this.localCommandManager);  

    // @ts-ignore
    this.mount.appendChild( this.graphics.renderer.domElement ); // must be located in the componentDidMount()
          
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
