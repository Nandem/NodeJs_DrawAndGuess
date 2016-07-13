/**
 * Created by Nandem on 2015/12/1.
 */

var fs = require("fs");
fs.readFileSync("../js/dataType.js");
//console.log(fs.readFileSync("js/dataType.js") + "");//文件相对于项目根目录路径
eval(fs.readFileSync("../js/dataType.js") + "");//eval()模拟浏览器运行环境
//console.log(drawMessage.startX)

var ws = require("websocket-server");

var server = ws.createServer();

var connIDS = [];//存每个连接
var connCount = 0;

function getFirstDrawingConnectionID()
{
    return Math.round(Math.random() * 3);
}

function isRight(answerStr)
{
    console.log(answerStr);
    var answer = JSON.parse(answerStr);
    console.log(answer);
    if(answer.content === gameContent.what)
    {
        gameOver.isOver = true;
        answer.content = answer.content.replace(gameContent.what, "*** 【有人答对】");
        console.log(answer.content);
        return JSON.stringify(answer);
    }
    return answerStr;
}

server.addListener("connection", function(connection)
{
    connCount++;
    console.log(connCount)
    connIDS.push(connection.id);
    if(connIDS.length == 4)
    {
        console.log("ready");
        tokenMessage.hasToken = true;
        getReady.isReady = true;
        server.broadcast(JSON.stringify(getReady));
        console.log("ready flag is sended!");
        var ID = getFirstDrawingConnectionID();
        console.log("ID:" + ID);
        server.send(connIDS[ID], JSON.stringify(tokenMessage));
        console.log("token is sended!");
        connectionID.getID = 0;
        server.send(connIDS[0], JSON.stringify(connectionID));
        connectionID.getID = 1;
        server.send(connIDS[1], JSON.stringify(connectionID));
        connectionID.getID = 2;
        server.send(connIDS[2], JSON.stringify(connectionID));
        connectionID.getID = 3;
        server.send(connIDS[3], JSON.stringify(connectionID));

        gameContent.what = "猪";
        gameContent.tip = "一种能吃的动物(一个字)"
        server.broadcast(JSON.stringify(gameContent));
    }
    connection.addListener("message", function(msg)
    {
//        server.broadcast(msg);
        server.broadcast(isRight(msg));
        console.log(msg);
    });
});

server.listen(7890);
console.log("My Server is running !")
