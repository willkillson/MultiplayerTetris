
//NodeImports
import * as io from 'socket.io-client';
import * as THREE from 'three';

//LocalImports
import * as GAME from '../Game/Game';
import * as GRAPHICS from '../Graphics/Graphics';
import * as PIECE from '../Game/entities/Piece/PlayerPiece';
import * as T from '../Util/types'



export class ClientNetwork {
    ////Networking
    clientId: string|null;
    socket: SocketIO.Socket;
    game: GAME.Game;

    constructor( isDevelop:boolean, game:GAME.Game ){
        this.clientId = null;
        this.socket = null;
        this.game = game;
        
        if (isDevelop) {
            this.socket = io('localhost:80');
        } else {
            this.socket = io('ec2-13-56-213-252.us-west-1.compute.amazonaws.com:80');
        }
                // SETUP NETWORK

        //TODO: sets the client ID for the client.
        this.socket.on('onConnected', (newClient)=> this.onConnected(newClient));

        //TODO: info is the uuid of the player that is disconnecting, and emited once
        //a player disconnects. 
        this.socket.on('onPlayerDisconnect', (info)=> this.onPlayerDisconnect(info));

        this.socket.on('onNewPlayer', (info) => this.onNewPlayer(info));

        this.socket.on('updateAllPlayers', (info)=> this.updateAllPlayers(info));

        this.socket.on('UPDATE', (info)=> this.onUpdate(info));

        this.socket.on('onPlayerSetPiece', (info)=> this.onPlayerSetPiece(info));

    }



    private onConnected(info:T.NewConnectionInfo) {
        console.log("onConnected - info:NewConnectionInfo")
        console.log(info)
        // this.clientId = info.clientId;
        // this.game.gameTimeVariables.syncTime = info.serverTime;
        // this.game.gameTimeVariables.previousTime = info.serverTime;
        
        this.game.updateNetworkInfo(info);
    }

    private onPlayerDisconnect(client:any){
        let index = this.game.scene.children.findIndex(child=>child.userData.owner=== client);
        if(index!==-1){
            let dcPlayersPiece = this.game.scene.children[index];
            this.game.scene.remove(dcPlayersPiece);
        }
    }

    private onNewPlayer(client:T.Client){
        // if(this.clientId!==client.id){   
        //     let position = client.position;
        //     let clientPieceType = client.pieceType;
        //     let newVector = new THREE.Vector3(position.x,position.y,position.z);
        //     if(clientPieceType!==null){
        //         // @ts-ignore
        //         console.log("onNewPlayer");
        //         let piece:any = PIECE.createPiece(this.game.scene, clientPieceType,newVector);
        //         piece.mesh.userData = {
        //             entityType : "active_piece",
        //             owner : client.id
        //         }
        //     }
        // }
    }

    private updateAllPlayers(clients:T.Client[]){
        //Gather all the active pieces from the scene.
        // let activePieces = this.game.scene.children.filter((child)=>{
        //     return child.userData.entityType==='active_piece';
        // });
        //Recreate them.
        // clients.forEach((clientPiece:Client)=>{
        //     let position = clientPiece.position;
        //     let clientPieceType = clientPiece.pieceType;
        //     let newVector = new THREE.Vector3(position.x,position.y,position.z);
        
        //     //let piece:any = PIECE..createPiece(this.game.scene, clientPieceType, newVector);
        //     let piece = new PIECE.Piece(this.game.scene,clientPieceType,)
        //     if(this.clientId===clientPiece.id){
        //         this.game.currentPiece = piece;
        //     }  
        //     piece.mesh.userData = {
        //         entityType : "active_piece",
        //         owner : clientPiece.id
        //     }
        //     piece.mesh.rotation.x = clientPiece.rotation.x;
        //     piece.mesh.rotation.y = clientPiece.rotation.y;
        //     piece.mesh.rotation.z = clientPiece.rotation.z;
        //     //if the position is 0,18,0, and the piece is imediatly blcoked down, then the game has ended.
        //     //console.log(clientPiece.position);
        //     if(clientPiece.position.x===0 && clientPiece.position.y===18 && clientPiece.position.z===0){
        //         piece.update();         
        //         if(piece.collision_isBlocked.down===true){
        //             // console.log(piece.collision_isBlocked);
        //             // //the game has ended
        //             // console.log("clearBoard");
        //             this.socket.emit('clearBoard');
        //             return;
        //         }
        //     }
            
        // });
        
    }

    private onUpdate(info:any){
        let updateInfo:T.UpdateInfo = JSON.parse(info);
        this.game.gameTimeVariables.syncTime = updateInfo.serverTime;
        if(updateInfo.persistentBlocks!==undefined){
        //clear the game
           if(updateInfo.persistentBlocks.length===0){
                //all persistent blocks are removed, reset game
                this.game.resetGame();
           }else{
            //we have a line clear or something.
                this.game.resetGame();
                this.updateBlocks(updateInfo.persistentBlocks);
           }
       }
       this.updateAllPlayers(updateInfo.users);
    }

    private onPlayerSetPiece(info:T.Block[]){
        info.forEach((block)=>{
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial( {color: block.color} );
            let newMesh = new THREE.Mesh(geometry,material);
            newMesh.position.x = block.position.x;
            newMesh.position.y = block.position.y;
            newMesh.position.z = block.position.z;
            newMesh.userData = {
                entityType : "inactive_piece",
                owner : block.uuid
            }
            this.game.scene.add(newMesh);
        })
    }

    private updateBlocks(blocks:T.Block[]) {
        blocks.forEach((block)=>{
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial( {color: block.color} );
            let newMesh = new THREE.Mesh(geometry,material);
            newMesh.position.x = block.position.x;
            newMesh.position.y = block.position.y;
            newMesh.position.z = block.position.z;
            newMesh.userData = {
                entityType : "inactive_piece",
                owner : block.uuid
            }
            this.game.scene.add(newMesh);
        })
    };

}