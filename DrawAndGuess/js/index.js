/**
 * Created by Nandem on 2015/11/19.
 */

var webSocketGame =
{
    canvas: null,
    ctx: null,
    canDraw: false,
    event:null,
    mouseStartX:0,
    mouseStartY:0,
    ws: null
};

var topController =
{
    $lineWidth : null,
    $lineColor : null,
    $lineEraser : null,
    $backgroundMusic : null,
    $colorSelector : null,
    $color : null,
    $selectedColor : null,
    $lineWidthSelector : null,
    $lineWidthBox : null,
    $line1 : null,
    $line2 : null,
    $line3 : null,
    $line4 : null,
    $line5 : null,
    $eraserSelector : null,
    $eraserBox : null,
    $eraser1 : null,
    $eraser2 : null,
    $eraser3 : null,
    $eraser4 : null,
    $eraser5 : null,
    $backgroundMusicSelector : null
};

var messaageController =
{
    $textField : null,
    $sendBtn : null
};

var playerController =
{
    $player1 : null,
    $messageBox1 : null,
    $player2 : null,
    $messageBox2 : null,
    $player3 : null,
    $messageBox3 : null,
    $player4 : null,
    $messageBox4 : null
};
var connectionController =
{
    currentID : 0,
    messageIntervalID : 0,
    hasToken : null
};

/*^_^*---------------------concrete function----------------------*^_^*/
function countDown()
{
    var tem = 5;
    $countDown.text("Ready?");
    var intervalID = setInterval(function ()
    {
        $countDown.text(tem);
        console.log(tem);
        tem--;
        if(tem < 0)
        {
            $countDown.text("Go!");
            clearInterval(intervalID);
            setTimeout(function (){$countDown.fadeOut("slow");}, 1000);
        }
    }, 1000);
}

function drawLine(x1, y1, x2, y2, color, lineWidth)
{
    webSocketGame.ctx.strokeStyle = color;
    webSocketGame.ctx.lineWidth = lineWidth;
    webSocketGame.ctx.beginPath();
    webSocketGame.ctx.moveTo(x1, y1);
    webSocketGame.ctx.lineTo(x2, y2);
    webSocketGame.ctx.closePath();
    webSocketGame.ctx.stroke();
}

function readyToDraw()
{
    $(webSocketGame.canvas)
        .mousedown(function ()
        {
            webSocketGame.event = event || window.event;
            webSocketGame.canDraw = true;
            webSocketGame.mouseStartX = webSocketGame.event.clientX - $(this).offset().left;
            webSocketGame.mouseStartY = webSocketGame.event.clientY - $(this).offset().top;
        })
        .mousemove(function ()
        {
            webSocketGame.event = event || window.event;
            if(webSocketGame.canDraw)
            {
                drawLine(webSocketGame.mouseStartX, webSocketGame.mouseStartY, webSocketGame.event.clientX - $(this).offset().left, webSocketGame.event.clientY - $(this).offset().top, drawMessage.color, drawMessage.lineWidth);
                drawMessage.startX = webSocketGame.mouseStartX;
                drawMessage.startY = webSocketGame.mouseStartY;
                drawMessage.endX = webSocketGame.event.clientX - $(this).offset().left;
                drawMessage.endY = webSocketGame.event.clientY - $(this).offset().top;
//                drawMessage.color = 'green';
//                drawMessage.$lineWidth = 3;
                webSocketGame.ws.send(JSON.stringify(drawMessage)); webSocketGame.mouseStartX = webSocketGame.event.clientX - $(this).offset().left;
                webSocketGame.mouseStartY = webSocketGame.event.clientY - $(this).offset().top;

            }
        })
        .mouseup(function ()
        {
            if(webSocketGame.canDraw)
            {
                webSocketGame.event = event || window.event;
                drawLine(webSocketGame.mouseStartX, webSocketGame.mouseStartY, webSocketGame.event.clientX - $(this).offset().left, webSocketGame.event.clientY - $(this).offset().top, drawMessage.color, drawMessage.lineWidth);
                webSocketGame.canDraw = false;
//                alert(dataType.color);
            }
        }).mouseout(function ()
        {
            webSocketGame.canDraw = false;
        });
}

function webSocketEvents()
{
    if(window.WebSocket)
    {
        webSocketGame.ws = new WebSocket("ws://127.0.0.1:7890");
        webSocketGame.ws.onopen = function (){console.log(2)};
        webSocketGame.ws.onclose = function (){};
        webSocketGame.ws.onerror = function (){};
        webSocketGame.ws.onmessage = function (msg)
        {
            var data = JSON.parse(msg.data);
            var messageBox;
            switch (data.type)
            {
                case dataType.ChatMessage:
                    if(data.connID == 0)
                    {
                        messageBox = playerController.$messageBox1;
                    }
                    else if(data.connID == 1)
                    {
                        messageBox = playerController.$messageBox2;
                    }
                    else if(data.connID == 2)
                    {
                        messageBox = playerController.$messageBox3;
                    }
                    else if(data.connID == 3)
                    {
                        messageBox = playerController.$messageBox4;
                    }
                    messageBox.show();
                    messageBox.text(data.content);
                    clearTimeout(connectionController.messageIntervalID);
                    connectionController.messageIntervalID = setTimeout(function ()
                    {
                        messageBox.fadeOut("slow");
                    }, 1500);
                    break;
                case dataType.DrawMessage:
//                    alert(1)
                    drawLine(data.startX, data.startY, data.endX, data.endY, data.color, data.lineWidth);
                    break;
                case dataType.GameContent:
                    if(connectionController.hasToken)
                    {
                        $("#tipsBox").text(data.what);
                    }
                    else
                    {
                        $("#tipsBox").text(data.tip);
                    }
                    break;
                case dataType.GameOver:
                    alert("game over!")
                    break;
                case dataType.TokenMessage:
//                    alert(data.hasToken);
                    connectionController.hasToken = data.hasToken;
                    if(data.hasToken)
                    {
                        readyToDraw();
                    }
                    break;
                case dataType.GetReady:
//                    alert("ready")
                    countDown();
                    break;
                case dataType.ConnectionID:
//                    console.log(111);
                    connectionController.currentID = data.getID;
                    if(connectionController.currentID == 0){playerController.$messageBox1.addClass("messageBoxCurrent")}
                    else if(connectionController.currentID == 1){playerController.$messageBox2.addClass("messageBoxCurrent")}
                    else if(connectionController.currentID == 2){playerController.$messageBox3.addClass("messageBoxCurrent")}
                    else if(connectionController.currentID == 3){playerController.$messageBox4.addClass("messageBoxCurrent")}
                    break;
            }
        };
    }
}

function controllerEvents()
{
    var colorSelectorTimeoutId;
    topController.$lineWidth.click(function ()
    {
        $(this).css({ "width" : "26px","height":"30px", "border-bottom" : "2px solid #f1f3ef", "border-left" : "2px solid #000000", "border-right" : "2px solid #000000"});
        topController.$lineWidthSelector.show();
    });
    topController.$lineWidthSelector.hover
    (
        function ()
        {
            clearTimeout(colorSelectorTimeoutId);
            $(this).show();
        },
        function ()
        {
            colorSelectorTimeoutId = setTimeout(function ()
            {
                topController.$lineWidthSelector.fadeOut("slow");
                topController.$lineWidth.css({ "width" : "30px", "border" : "0px solid #f1f3ef"});

            }, 500);
        }
    );
    topController.$lineWidthBox.hover
    (
        function ()
        {
            $(this).css({"border" : "1px dotted #000000", "height" : "21"});
        },
        function ()
        {
            $(this).css({"border" : "0px dotted #000000", "height" : "23"});
        }
    );
    topController.$lineWidthBox.click(function ()
    {
        $("#lineWidthSelector").children("div").css({"background" : "#f1f3ef"});
//        $(this).selectAllChildren("div").css({"background" : "white"});
        drawMessage.lineWidth = $(this).children("div").height();
        drawMessage.color = drawMessage.currentColor;
        $(this).css({"background" : "gray"});
    });
    topController.$lineColor.click(function ()
    {
        $(this).css({ "width" : "26px","height":"30px", "border-bottom" : "2px solid #f1f3ef", "border-left" : "2px solid #000000", "border-right" : "2px solid #000000"});
        topController.$colorSelector.show();
    });
    topController.$colorSelector.hover
    (
        function ()
        {
            clearTimeout(colorSelectorTimeoutId);
            $(this).show();
        },
        function ()
        {
            colorSelectorTimeoutId = setTimeout(function ()
            {
                topController.$colorSelector.fadeOut("slow");
                topController.$lineColor.css({ "width" : "30px", "border" : "0px solid #f1f3ef"});

            }, 500);
        }
    );

    topController.$lineEraser.click(function ()
    {
        $(this).css({ "width" : "26px","height":"30px", "border-bottom" : "2px solid #f1f3ef", "border-left" : "2px solid #000000", "border-right" : "2px solid #000000"});
        topController.$eraserSelector.show();
    });
    topController.$eraserSelector.hover
    (
        function ()
        {
            clearTimeout(colorSelectorTimeoutId);
            $(this).show();
        },
        function ()
        {
            colorSelectorTimeoutId = setTimeout(function ()
            {
                topController.$eraserSelector.fadeOut("slow");
                topController.$lineEraser.css({ "width" : "30px", "border" : "0px solid #f1f3ef"});

            }, 500);
        }
    );
    topController.$eraserBox.click(function ()
    {
        $("#eraserSelector").children("div").css({"background" : "#f1f3ef"});
//        $(this).selectAllChildren("div").css({"background" : "white"});
        drawMessage.lineWidth = $(this).children("div").height();
        drawMessage.currentColor = drawMessage.color;
//        alert(drawMessage.currentColor);
        drawMessage.color = "#f1f3ef";
        $(this).css({"background" : "gray"});
    });
    topController.$eraserBox.hover
    (
        function ()
        {
            $(this).css({"border" : "1px dotted #000000", "height" : "21"});
        },
        function ()
        {
            $(this).css({"border" : "0px dotted #000000", "height" : "23"});
        }
    );

    topController.$backgroundMusic.click(function ()
    {
        $(this).css({ "width" : "26px","height":"30px", "border-bottom" : "2px solid #f1f3ef", "border-left" : "2px solid #000000", "border-right" : "2px solid #000000"});
        topController.$backgroundMusicSelector.show();
    });
    topController.$backgroundMusicSelector.hover
    (
        function ()
        {
            clearTimeout(colorSelectorTimeoutId);
            $(this).show();
        },
        function ()
        {
            colorSelectorTimeoutId = setTimeout(function ()
            {
                topController.$backgroundMusicSelector.fadeOut("slow");
                topController.$backgroundMusic.css({ "width" : "30px", "border" : "0px solid #f1f3ef"});

            }, 500);
        }
    );
}

function sendMessage()
{
    var content = messaageController.$textField.val();
    chatMessage.content = content;
    chatMessage.connID = connectionController.currentID;
    webSocketGame.ws.send(JSON.stringify(chatMessage));
    messaageController.$textField.val("");
}

function messageEvents()
{
    messaageController.$sendBtn.click(function ()
    {
        sendMessage();
    });
}

function keyEvents()
{
    $(document).keydown(function (event)
    {
        switch (event.keyCode)
        {
            case 13:
                sendMessage();
                break;
        }
    });
}

/*^_^*-------------------------------------------*^_^*/
function initEvents()
{
    webSocketEvents();
    controllerEvents();
    messageEvents();
    keyEvents();
}

function initColor()
{
    $("#firstColor").click(function ()
    {
        topController.$selectedColor.css({"background" : $(this).css('background-color')});
        drawMessage.color = $(this).css('background-color');
    });
    var $color = $(".color");
    for(var i = 0; i < 75; i++)
    {
        var cl = $color.clone();
        var colorStr ="#" + (Math.round(Math.random() * 9)) + (Math.round(Math.random() * 9)) + (Math.round(Math.random() * 9));
        cl.css({"background" : colorStr});
        cl.appendTo($("#alternativeColor"));
        cl.click(function ()
        {
            topController.$selectedColor.css({"background" : $(this).css('background-color')});
            drawMessage.color = $(this).css('background-color');
        });
    }
    var lastColor = $color.clone();
    lastColor.css({"background" : "#ffffff"});
    lastColor.appendTo($("#alternativeColor"));
    lastColor.click(function ()
    {
        topController.$selectedColor.css({"background" : $(this).css('background-color')});
        drawMessage.color = $(this).css('background-color');
    });
}

function initComponents()
{
    webSocketGame.canvas = $("#paintingPad")[0];
    webSocketGame.ctx = webSocketGame.canvas.getContext("2d");
    topController.$lineWidth = $("#lineWidth");
    topController.$lineColor = $("#lineColor");
    topController.$lineEraser = $("#lineEraser");
    topController.$backgroundMusic = $("#backgroundMusic");
    topController.$colorSelector = $("#colorSelector");
    topController.$color = $("#color");
    topController.$selectedColor = $("#selectedColor");
    topController.$lineWidthSelector = $("#lineWidthSelector");
    topController.$lineWidthBox = $(".lineWidthBox");
    topController.$line1 = $("#line1");
    topController.$line2 = $("#line2");
    topController.$line3 = $("#line3");
    topController.$line4 = $("#line4");
    topController.$line5 = $("#line5");
    topController.$eraserSelector = $("#eraserSelector");
    topController.$eraserBox = $(".eraserBox");
    topController.$eraser1 = $("#eraser1");
    topController.$eraser2 = $("#eraser2");
    topController.$eraser3 = $("#eraser3");
    topController.$eraser4 = $("#eraser4");
    topController.$eraser5 = $("#eraser5");
    topController.$backgroundMusicSelector = $("#backgroundMusicSelector");
    messaageController.$textField = $("#textField");
    messaageController.$textField.focus();
    messaageController.$sendBtn = $("#sendBtn");
    playerController.$player1 = $("#playerOne");
    playerController.$messageBox1 = $("#messageBox1");
    playerController.$player2 = $("#playerTwo");
    playerController.$messageBox2 = $("#messageBox2");
    playerController.$player3 = $("#playerThree");
    playerController.$messageBox3 = $("#messageBox3");
    playerController.$player4 = $("#playerFour");
    playerController.$messageBox4 = $("#messageBox4");
    $countDown = $("#countdown");
}

/*^_^*-------------------------------------------*^_^*/
function init()
{
    initComponents();
    initEvents();
    initColor();
//    countDown();

}

/*^_^*-------------------------------------------*^_^*/
$().ready(function ()
{
    init();
});