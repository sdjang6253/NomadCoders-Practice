import express from "express";
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
app.listen(3000, handleListen);