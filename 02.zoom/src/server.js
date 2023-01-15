import express from "express";
import http from "http";
import https from 'https';
import fs from 'fs';
import {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui";
//강의에서는 __dirname 이 기본으로 가져와 지지만 나는 그게 안되어서 임의로 가져와줌.
// package.json 에서 type:module 을 추가한 뒤로 이렇게 되는것 같음. 
import path from "path";

const options = {
    key: fs.readFileSync('/mnt/01.Development/rootca.key'),
    cert: fs.readFileSync('/mnt/01.Development/rootca.crt')
  };

const app = express();
const __dirname = path.resolve();

//pug 사용 설정
app.set("view engine" , "pug");
app.set("views", __dirname + "/src/views" );

//static 파일들의 위치를 지정해주기. 
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/" , (req, res) => res.render("home"));
app.get("/*" , (req, res) => res.redirect("/"));


const handleListen = () => console.log(`Listening on http://localhost:3000`);
const handleHttpsListen = () => console.log(`Listening on http://localhost:3003`);

const httpServer = http.createServer(app);// websocker 을 하기위해 server 를 명시적? 으로 생성
const httpsServer = https.createServer(options, app);
const wsServer = new Server(httpServer);
const httpsWsServer = new Server(httpsServer);

httpServer.listen(3000, handleListen); // app.listen() 이랑 별반 차이 없어보이지만 이로 인해 http 와 ws 를 둘다 구동 가능
httpsServer.listen(3003, handleHttpsListen); 
//2023.01.08  당장은 https 를 node 에서 올리지만, nginx를 추가해서 해당 설정 nginx로 옮길수 있도록 수정 

httpsWsServer.on('connection' , socket => {
    socket.on('join_room' , (roomName , done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit('welcome');
    });
    socket.on('offer' , (offer , roomName) => {
        socket.to(roomName).emit('offer' , offer);
    });
} )