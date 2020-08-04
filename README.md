# Project is hosted with AWS EC2 

[Multiplayer Tetris](http://willkillson.ddns.net:5000/). 

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
