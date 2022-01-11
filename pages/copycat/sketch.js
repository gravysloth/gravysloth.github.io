var QWERTY = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
["A", "S", "D", "F", "G", "H", "J", "K", "L"],
["Z", "X", "C", "V", "B", "N", "M"]];

var copycat = function(a)
{
    a.setup = function()
    {
        var canvas = a.createCanvas(600, 600);
        canvas.parent("sketch");
        a.frameRate(30);
    }

    a.draw = function()
    {
        a.background(77, 77, 77);
        drawKeyboard(425);
    }

    drawKey = function(x, y, w, h, letter)
    {
        a.push();
        a.fill(143, 143, 143);
        a.rect(x, y, w, h, 10);
        a.fill(0);
        a.textSize(20);
        a.textAlign(a.CENTER, a.CENTER);
        a.text(letter, x + w/2, y + h/2);
        a.pop();
    }


    var specialKeySize = 85;
    var keySize = 40;
    drawKeyboard = function(y)
    {
        for (var r = 0; r < QWERTY.length; r++)
        {
            for (var k = 0; k < QWERTY[r].length; k++)
            {
                drawKey(a.width/2 - QWERTY[r].length*(keySize + 5)/2 + k*(keySize + 5), y + (keySize + 5)*r, keySize, keySize, QWERTY[r][k]);
            }
        }
        drawKey(a.width/2 - QWERTY[2].length*(keySize + 5)/2 - specialKeySize - 5, y + (keySize + 5)*2, specialKeySize, keySize, "ENTER");
        drawKey(a.width/2 + QWERTY[2].length*(keySize + 5)/2, y + (keySize + 5)*2, specialKeySize, keySize, "⌫");
    }
}

class Key
{
    constructor(x, y, w, h, state)
    {

    }
}

var copycatP5 = new p5(copycat, "sketch")