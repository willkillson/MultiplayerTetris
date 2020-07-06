import {BoxGeometry, MeshBasicMaterial, Mesh} from "three";
import {Vector3} from "three";
class Piece{

    constructor(pDefaultPositions = [
        new Vector3(0,0,0),
        new Vector3(-1,0,0),
        new Vector3(1,0,0),
        new Vector3(0,-1,0)],
        pColor =  0x990000 
        ){

        //is our default position;

        this.default_position = pDefaultPositions


        this.vx = 0.05*Math.random();
        this.vy = 0.05*Math.random();
        this.vz = 0.05*Math.random();

        this.movUp = true;
        this.movRight = true;
        this.moveForward = true;


        this.clamp = 10;

        this.posX = 0;
        this.posY = 0;
        this.posZ = 0;
        
        this.sizeX = 1;
        this.sizeY = 1;
        this.sizeZ = 1;
        
        this.meshs = [];

        this.default_position.forEach((pos)=>{
            let geometry = new BoxGeometry(1,1,1);
            let material = new MeshBasicMaterial( { color: pColor } );
            geometry.translate(
                pos.toArray()[0],
                pos.toArray()[1],
                pos.toArray()[2]);
            let mesh = new Mesh(geometry,material);
            this.meshs.push(mesh);
        });

    }

    setPosition(x,y,z){

    //     this.posX = x;
    //     this.posY = y;
    //     this.posZ = z;

    //     this.meshs.forEach((p)=>{
    //         p.position.setPosition(new Vector3(x,y,z));
    //     })
    // 
    }

    move(x,y,z){
        this.posX += x;
        this.posY += y;
        this.posZ += z;

        this.meshs.forEach((p)=>{

            p.position.add(new Vector3(x,y,z));
        })
    }

    rotate(angle_x, angle_y, angle_z) {
        this.meshs.forEach((p)=>{
            p.rotation.x += angle_x;
            p.rotation.y += angle_y;
            p.rotation.z += angle_z;
        });
    };

    update(){

        this.rotate(0.01,0.01);

        //left right
        if(this.posX>this.clamp){
            this.movRight = false;
        }

        if(this.posX < -this.clamp){
        this.movRight = true;
        }

        if(this.movRight){
        this.move(this.vx,0,0);
        }else{
        this.move(-this.vx,0,0);
        }

        ////// up down
        if(this.posY>this.clamp){
            this.movUp = false;
        }

        if(this.posY < -this.clamp){
        this.movUp = true;
        }

        if(this.movUp){
        this.move(0,this.vy,0);
        }else{
        this.move(0,-this.vy,0);
        }

        ////// forward back
        if(this.posZ>this.clamp){
            this.moveForward = false;
        }

        if(this.posZ < -this.clamp){
        this.moveForward = true;
        }

        if(this.moveForward){
        this.move(0,0,this.vz);
        }else{
        this.move(0,0,-this.vy);
        }
    
    
    }

}

export default Piece;
