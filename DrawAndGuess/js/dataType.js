/**
 * Created by Nandem on 2015/12/1.
 */
var dataType =
{
    ChatMessage : 0,
    DrawMessage : 1,
    TokenMessage : 2,
    GetReady : 3,
    ConnectionID : 4,
    GameOver : 5,
    GameContent : 6
};

var chatMessage =
{
    type : dataType.ChatMessage,
    content : null,
    connID : 0
};

var drawMessage =
{
    type : dataType.DrawMessage,
    startX : 0,
    startY : 0,
    endX : 0,
    endY : 0,
    color : 'black',
    currentColor : 'black',
    lineWidth : 0
};

var tokenMessage =
{
    type : dataType.TokenMessage,
    hasToken : false
};

var getReady =
{
    type : dataType.GetReady,
    isReady : false
};

var connectionID =
{
    type : dataType.ConnectionID,
    getID : 0
};

var gameOver =
{
    type : dataType.GameOver,
    isOver : false
};

var gameContent =
{
    type : dataType.GameContent,
    what : null,
    tip : null
};