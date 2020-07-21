import * as THREE from 'three';
import {TextureLoader, sRGBEncoding} from 'three';


export const levelFloor = () => {
  const textureLoader = new TextureLoader();

  const ground = textureLoader.load('https://1.bp.blogspot.com/-UUcpvJhIZZo/UmpLlYOQarI/AAAAAAAAElc/QXKB9p_zcLc/s1600/Dirt+05+seamless.jpg');
  const grass = textureLoader.load('https://2.bp.blogspot.com/-fE9MlCU4_80/T1b0hMWgvvI/AAAAAAAAAVA/LyELATlfKYk/s1600/grass+3.jpg');

  ground.encoding = sRGBEncoding;
  grass.encoding = sRGBEncoding;

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
  group.add(new THREE.Mesh(grassGeometry1, grassMaterial));
  group.add(new THREE.Mesh(grassGeometry2, grassMaterial));
  group.add(new THREE.Mesh(grassGeometry3, grassMaterial));
  group.add(new THREE.Mesh(grassGeometry4, grassMaterial));
  group.add(new THREE.Mesh(grassGeometry5, grassMaterial));
  group.add(new THREE.Mesh(grassGeometry6, grassMaterial));

  group.add(new THREE.Mesh(groundGeometry, groundMaterial));

  return group;
};

export const frame = () => {
  const textureLoader = new TextureLoader();
  const metal = textureLoader.load('https://3.bp.blogspot.com/-yrh_atograU/UFhj_v6uBvI/AAAAAAAACKU/tWXypPzRhYo/s1600/Seamless+coloured+carpet+floor+texture.jpg');
  metal.encoding = sRGBEncoding;
  metal.anisotropy = 16;
  const metalMaterial = new THREE.MeshBasicMaterial( {
    map: metal,
  });

  const group = new THREE.Object3D();
  for (let i = 0; i< 12; i++) {
    const geo_xb = new THREE.BoxBufferGeometry(1, 1, 1);
    const geo_xt = new THREE.BoxBufferGeometry(1, 1, 1);
    geo_xb.name = 'wall';
    geo_xt.name = 'wall';
    geo_xb.translate(i, 0, 0);
    geo_xt.translate(i, 20, 0);
    group.add(new THREE.Mesh(geo_xb, metalMaterial));
    group.add(new THREE.Mesh(geo_xt, metalMaterial));
  }

  for (let i = 0; i< 20; i++) {
    const geo_yl = new THREE.BoxBufferGeometry(1, 1, 1);
    const geo_yr = new THREE.BoxBufferGeometry(1, 1, 1);
    geo_yl.name = 'wall';
    geo_yr.name = 'wall';
    geo_yl.translate(0, i, 0);
    geo_yr.translate(11, i, 0);
    group.add(new THREE.Mesh(geo_yl, metalMaterial));
    group.add(new THREE.Mesh(geo_yr, metalMaterial));
  }


  return group;
};

export const sky = () =>{
// https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/71eeef2d-6d2f-4799-a0d0-469308125783/d6h6gkp-590c6916-43b9-40ff-a650-35518b849ce2.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi83MWVlZWYyZC02ZDJmLTQ3OTktYTBkMC00NjkzMDgxMjU3ODMvZDZoNmdrcC01OTBjNjkxNi00M2I5LTQwZmYtYTY1MC0zNTUxOGI4NDljZTIuanBnIn1dXX0.xji_D8X-yYgPiYskTttDKMDakezJrvLx5QCzQEJpKFA
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/71eeef2d-6d2f-4799-a0d0-469308125783/d6h6gkp-590c6916-43b9-40ff-a650-35518b849ce2.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi83MWVlZWYyZC02ZDJmLTQ3OTktYTBkMC00NjkzMDgxMjU3ODMvZDZoNmdrcC01OTBjNjkxNi00M2I5LTQwZmYtYTY1MC0zNTUxOGI4NDljZTIuanBnIn1dXX0.xji_D8X-yYgPiYskTttDKMDakezJrvLx5QCzQEJpKFA');
  texture.encoding = sRGBEncoding;
  texture.anisotropy = 16;
  const material = new THREE.MeshBasicMaterial( {
    map: texture,
  });

  const geometry = new THREE.BoxBufferGeometry(1000, 0.0001, 1000);

  const group = new THREE.Object3D();
  geometry.translate(0, 25, 0);
  group.add(new THREE.Mesh(geometry, material));


  return group;
};
