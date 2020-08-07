
//NodeImports
import * as THREE from 'three';
import * as GAME from '../../common-game/Game';
import * as CONTROLMANAGER from '../Controls/ControlManager'
import * as NETWORK from '../Network/ClientNetwork'

export class Graphics {
    ////Graphics
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private totalTime: number;

    ////Graphics//Animations
    mixers: THREE.AnimationMixer[];
    clock: THREE.Clock;

    ////EngineStuff
    private game: GAME.Game;
    private controlManager: CONTROLMANAGER.ControlManager;
    private network: NETWORK.ClientNetwork;

    constructor(){
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

    public init(game:GAME.Game, 
      controlManager:CONTROLMANAGER.ControlManager,
      network:NETWORK.ClientNetwork){
      this.game = game;
      this.controlManager = controlManager;
      this.network = network;
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
            if(this.game.clientId===null){
                requestAnimationFrame( animate );
            }
            

            

            // get updates from network 

            // populate the ControlManager with updates

            // tick game with change

            // emit any new changes

            console.log(this.controlManager);
            //this.game.tick();
            this.renderer.render( this.game.scene, this.camera );
            requestAnimationFrame( animate );
        };


        // @ts-ignore
       animate(); 
    }


}