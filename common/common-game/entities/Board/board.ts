// @ts-ignore
import * as THREE from 'three';

export const levelFloor = () => {

  const textureLoader = new THREE.TextureLoader();

  const ground = textureLoader.load('https://1.bp.blogspot.com/-UUcpvJhIZZo/UmpLlYOQarI/AAAAAAAAElc/QXKB9p_zcLc/s1600/Dirt+05+seamless.jpg');
  const grass = textureLoader.load('https://2.bp.blogspot.com/-fE9MlCU4_80/T1b0hMWgvvI/AAAAAAAAAVA/LyELATlfKYk/s1600/grass+3.jpg');

  ground.encoding = THREE.sRGBEncoding;
  grass.encoding = THREE.sRGBEncoding;

  ground.anisotropy = 16;
  grass.anisotropy = 16;

  const grassMaterial = new THREE.MeshBasicMaterial( {
    map: grass,
  });

  const groundMaterial = new THREE.MeshBasicMaterial( {
    map: ground,
  });

  const grassGeometry1 = new THREE.BoxBufferGeometry(30, 0.0001, 30);
  const grassGeometry2 = new THREE.BoxBufferGeometry(30, 0.0001, 30);
  const grassGeometry3 = new THREE.BoxBufferGeometry(30, 0.0001, 30);
  const grassGeometry4 = new THREE.BoxBufferGeometry(30, 0.0001, 30);
  const grassGeometry5 = new THREE.BoxBufferGeometry(30, 0.0001, 30);
  const grassGeometry6 = new THREE.BoxBufferGeometry(30, 0.0001, 30);

  grassGeometry1.translate(0, 0, 0);
  grassGeometry2.translate(30, 0, 0);
  grassGeometry3.translate(60, 0, 0);
  grassGeometry4.translate(90, 0, 0);
  grassGeometry5.translate(-30, 0, 0);
  grassGeometry6.translate(-60, 0, 0);

  const groundGeometry = new THREE.BoxBufferGeometry(30, 0.0001, 30);
  groundGeometry.translate(0, -0.01, 0);

  const group = new THREE.Object3D();


  const m1 = new THREE.Mesh(grassGeometry2, grassMaterial);
  const m2 = new THREE.Mesh(grassGeometry3, grassMaterial);
  const m3 = new THREE.Mesh(grassGeometry4, grassMaterial);
  const m4 = new THREE.Mesh(grassGeometry5, grassMaterial);
  const m5 = new THREE.Mesh(grassGeometry6, grassMaterial);
  const m6 = new THREE.Mesh(groundGeometry, grassMaterial);

  m1.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }
  m2.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }

  m3.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }

  m4.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }

  m5.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }

  m6.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }

  group.add(m1);
  group.add(m2);  
  group.add(m3);  
  group.add(m4);  
  group.add(m5);  
  group.add(m6);


  group.userData = {
    entityType : "floor",
    owner : "LEVEL_1"
  }
  return group;
};

export const frame = () => {
  const width = 24;
  const height = 20;
  
  const textureLoader = new THREE.TextureLoader();
  let material;
  textureLoader.loadAsync('https://3.bp.blogspot.com/-yrh_atograU/UFhj_v6uBvI/AAAAAAAACKU/tWXypPzRhYo/s1600/Seamless+coloured+carpet+floor+texture.jpg',
  (texture:any)=>{
    material = texture;
  })
  .then((texture)=>{
        //success
        
  
  },()=>{
        //rejected
        material = new THREE.MeshLambertMaterial( {color: 0xff00ff});
  });


  const group = new THREE.Object3D();
  const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  for (let i = 0; i< height; i++) {
    let leftWall = new THREE.Mesh(geometry, material);
    let rightWall = new THREE.Mesh(geometry, material);
    leftWall.position.set(0,i,0);
    rightWall.position.set(width,i,0);
    leftWall.userData = {
      entityType : "frame",
      owner : "LEVEL_1"
    }
    rightWall.userData = {
      entityType : "frame",
      owner : "LEVEL_1"
    }
    group.add(leftWall);
    group.add(rightWall);
  }

  for (let i = 0; i< width+1; i++) {
    let bottomWall = new THREE.Mesh(geometry, material);
    let topWall = new THREE.Mesh(geometry, material);
    bottomWall.position.set(i,0,0);
    topWall.position.set(i,height,0);
    bottomWall.userData = {
      entityType : "frame",
      owner : "LEVEL_1"
    }
    topWall.userData = {
      entityType : "frame",
      owner : "LEVEL_1"
    }
    group.add(topWall);
    group.add(bottomWall);
  }
  group.userData = {
    entityType : "frame",
    owner : "LEVEL_1"
  }
  group.name = group.userData.entityType;
  group.position.set(-5,1,0);
  return group;
};

export const sky = () =>{
// https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/71eeef2d-6d2f-4799-a0d0-469308125783/d6h6gkp-590c6916-43b9-40ff-a650-35518b849ce2.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi83MWVlZWYyZC02ZDJmLTQ3OTktYTBkMC00NjkzMDgxMjU3ODMvZDZoNmdrcC01OTBjNjkxNi00M2I5LTQwZmYtYTY1MC0zNTUxOGI4NDljZTIuanBnIn1dXX0.xji_D8X-yYgPiYskTttDKMDakezJrvLx5QCzQEJpKFA
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/71eeef2d-6d2f-4799-a0d0-469308125783/d6h6gkp-590c6916-43b9-40ff-a650-35518b849ce2.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi83MWVlZWYyZC02ZDJmLTQ3OTktYTBkMC00NjkzMDgxMjU3ODMvZDZoNmdrcC01OTBjNjkxNi00M2I5LTQwZmYtYTY1MC0zNTUxOGI4NDljZTIuanBnIn1dXX0.xji_D8X-yYgPiYskTttDKMDakezJrvLx5QCzQEJpKFA');
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;
  const material = new THREE.MeshBasicMaterial( {
    map: texture,
  });

  const geometry = new THREE.BoxBufferGeometry(1000, 0.0001, 1000);

  const group = new THREE.Object3D();
  geometry.translate(0, 80, 0);
  group.add(new THREE.Mesh(geometry, material));

  group.userData = {
    entityType : "skyBox",
    owner : "LEVEL_1"
  }

  return group;
};
