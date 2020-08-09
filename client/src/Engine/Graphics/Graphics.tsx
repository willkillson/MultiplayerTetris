
//NodeImports
import * as THREE from 'three';
import * as GAME from '../../common-game/Game';
import * as CM from '../Controls/ControlManager'
import * as NETWORK from '../Network/ClientNetwork'
import * as ENGINE from  '../Engine';

export class Graphics {
    ////Graphics
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private totalTime: number;

    ////Graphics//Animations
    mixers: THREE.AnimationMixer[];
    clock: THREE.Clock;

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

        const animate = (now) => {
            now = now * 0.001; //change to seconds
            const dt = now - this.totalTime;
            this.totalTime = now;
            this.resizeRendererToDisplaySize();//resizes if need be.            
            //TODO: perhaps refactor this and remove the control manager.
            if(this.engine.game.clientId===null || this.engine.localCommandManager.clientId===null){
                this.engine.localCommandManager.clientId = this.engine.game.clientId;
                requestAnimationFrame( animate );
            }
            

            

            // get updates from network 

            // populate the ControlManager with updates

            // tick game with change

            // emit any new changes

           
            const localCommand = this.engine.localCommandManager.getCommand();  
            const networkCommand = this.engine.networkCommandManager.getCommand();  
            
            if(networkCommand!==undefined){
                
                this.engine.game.processCommand(networkCommand);
            }

            if(this.engine.game.gameState.waitingForNewPiece){
                console.log("Waiting for new piece from the server.");
                requestAnimationFrame( animate );
            }

            if(localCommand!==undefined){
                if(this.engine.game.isCommandPossible(localCommand)){
                    this.engine.game.processCommand(localCommand);
                    this.engine.network.sendCommand(localCommand);
                }
            }
            
            this.renderer.render( this.engine.game.scene, this.camera );
            requestAnimationFrame( animate );
        };


        // @ts-ignore
       animate(); 
    }


}