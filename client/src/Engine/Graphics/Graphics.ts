
//NodeImports
import * as THREE from 'three';

import * as GAME from '../../common-game/Game';
import * as CM from '../Controls/ControlManager';
import * as NETWORK from '../Network/ClientNetwork';
import * as T from '../../common-utilities/types';
import * as ENGINE from  '../Engine';

export class Graphics {
    ////Graphics
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private totalTime: number;

    ////Graphics//Animations
    mixers: THREE.AnimationMixer[];
    clock: THREE.Clock;
    stats:any;

    ////EngineStuff
    private engine: ENGINE.Engine;  

    constructor(engine:ENGINE.Engine){
        this.engine = engine;
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0);
        this.renderer.gammaFactor = 2.2;
        // camera position
        this.camera.position.y = 10;
        this.camera.position.x = 0;
        this.camera.position.z = 15;

        //animations
        this.mixers = [];
        this.clock = new THREE.Clock();

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight,
        );
        this.totalTime = 0;
    }

    public resizeRendererToDisplaySize() {
        const canvas = this.renderer.domElement;
        const needResize = canvas.width !== window.innerWidth || window.innerHeight !== canvas.height;
        if (needResize) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth ,window.innerHeight, true);
        }
    }

    public start(){

        let start = Date.now();
        // @ts-ignore
        const animate = (now:any) => {
 
            let d = Date.now() - start;
          
            console.log(d);
            
            // if(then>1.0){
            //     console.log(then);
            //     then = 0;
            //     console.log(frames);
            //     frames = 0;
               
            // }

            // frames++;
       

            
            
            this.resizeRendererToDisplaySize();//resizes if need be.       
            
            
            if(this.engine.game.localPlayerPiece===undefined){
                console.log("Waiting to connect!");
                requestAnimationFrame( animate );
            }

            
   
    
            // get updates from network 
            // populate the ControlManager with updates
            // tick game with change
            // emit any new changes
           
           
           //console.log(dt);
           
            const networkCommand = this.engine.networkCommandManager.getCommand();  
            if(networkCommand!==undefined){
                console.log({networkCommand});
                this.engine.game.processCommand(networkCommand);
            }

        //     if(this.engine.game.gameState.waitingForNewPiece){
        //         console.log("Waiting for new piece from the server.");
        //         requestAnimationFrame( animate );
        //     }
            let localCommand = this.engine.localCommandManager.getCommand();  
            if(localCommand!==undefined){
                console.log({localCommand});
                console.log(this.engine.game.clientId);
                localCommand.id = this.engine.game.clientId;
                if(this.engine.game.isCommandPossible(localCommand)){
                    this.engine.game.processCommand(localCommand);
                    this.engine.network.sendCommand(localCommand);
                }
                this.renderer.render( this.engine.game.scene, this.camera );
            }

         
            
            
           this.renderer.render( this.engine.game.scene, this.camera );
            requestAnimationFrame( animate );
        };


        // @ts-ignore
       animate(); 
    }


}