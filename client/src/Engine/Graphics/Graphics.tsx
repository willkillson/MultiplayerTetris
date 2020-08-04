
//NodeImports
import * as THREE from 'three';
import * as GAME from '../Game/Game';
import * as CONTROLMANAGER from '../Controls/ControlManager'
import * as NETWORK from '../Network/ClientNetwork'

export class Graphics {
    ////Graphics
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    totalTime: number;
    width: number;
    height: number;

    ////EngineStuff
    game: GAME.Game;
    controlManager: CONTROLMANAGER.ControlManager;
    network: NETWORK.ClientNetwork;

    constructor(){

      this.renderer = new THREE.WebGLRenderer();
      this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
      this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0);
      this.renderer.gammaFactor = 2.2;
      // camera position
      this.camera.position.y = 10;
      this.camera.position.x = 0;
      this.camera.position.z = 15;
      this.width = window['document'].getElementById('myCanvas').clientWidth;
      this.height = window['document'].getElementById('myCanvas').clientHeight;
      this.renderer.setSize(
          1000,
          640,
      );
      this.totalTime = 0;

    

    }

    public init(game:GAME.Game, 
      controlManager:CONTROLMANAGER.ControlManager,
      network:NETWORK.ClientNetwork){
      this.game = game;
      this.controlManager = controlManager;
      this.network = network;

    }

    public start(){
      const animate = (now) => {
          now = now * 0.001; //change to seconds
          const dt = now - this.totalTime;
          this.totalTime = now;
    
          if (this.width!==window['document'].getElementById('myCanvas').clientWidth) {
              this.width = window['document'].getElementById('myCanvas').clientWidth;
              this.height = window['document'].getElementById('myCanvas').clientWidth*0.5625;
            this.renderer.setSize(
              this.width,
              this.height,
            );
          }
    
          //TODO: perhaps refactor this and remove the control manager.
          if(this.game.clientId!==undefined){
            this.game.update(this.controlManager);
          }

          //animations
          for( const mixer of this.game.mixers ){
             mixer.update( dt );
          }
          

          this.renderer.render( this.game.scene, this.camera );
          requestAnimationFrame( animate );
        };
        // @ts-ignore
        animate(); 
        
    }
}