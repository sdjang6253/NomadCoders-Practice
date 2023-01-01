import express from "express";
import http from "http";
import {Server} from "socket.io";
import { instrument } from "@socket.io/admin-ui";
//강의에서는 __dirname 이 기본으로 가져와 지지만 나는 그게 안되어서 임의로 가져와줌.
// package.json 에서 type:module 을 추가한 뒤로 이렇게 되는것 같음. 
import path from "path";

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

const httpServer = http.createServer(app);// websocker 을 하기위해 server 를 명시적? 으로 생성
const wsServer = new Server(httpServer);

httpServer.listen(3000, handleListen); // app.listen() 이랑 별반 차이 없어보이지만 이로 인해 http 와 ws 를 둘다 구동 가능