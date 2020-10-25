![image](https://user-images.githubusercontent.com/26101774/97098085-449b3700-1636-11eb-8b67-4cb8c93a7b98.png)

# Start project with docker 
 
Make sure ./client/src/Tetris.js is set to local host for local development. 

EX 

this.socket = io('localhost:80');   

//this.socket = io('ec2-52-53-191-238.us-west-1.compute.amazonaws.com:80');   

docker-compose up --build 

# Start the server without docker

cd server 

npm install  

npm start 


# Start the client without docker

cd .. 

cd client 

npm install 

npm start 
