var QWERTY = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
["A", "S", "D", "F", "G", "H", "J", "K", "L"],
["Z", "X", "C", "V", "B", "N", "M"]];

var keys = [];
var enterKey;
var deleteKey;
var currentEntry = "";
var guesses = [[""], [""], [""], [""], [""], [""]]
var whatGuessAreWeOn = 0;

var copycat = function(a)
{
    a.setup = function()
    {
        var canvas = a.createCanvas(600, 600);
        canvas.parent("sketch");
        a.frameRate(30);

        for (var r = 0; r < QWERTY.length; r++)
        {
            for (var k = 0; k < QWERTY[r].length; k++)
            {
                keys.push(new LetterKey(a.width/2 - QWERTY[r].length*(keySize + 5)/2 + k*(keySize + 5), 425 + (keySize + 5)*r, keySize, keySize, QWERTY[r][k], 0))
            }
        }
        enterKey = new EnterKey(a.width/2 - QWERTY[2].length*(keySize + 5)/2 - specialKeySize - 5, 425 + (keySize + 5)*2, specialKeySize, keySize);

        deleteKey = new DeleteKey(a.width/2 + QWERTY[2].length*(keySize + 5)/2, 425 + (keySize + 5)*2, specialKeySize, keySize)
    }

    a.draw = function()
    {
        a.background(77, 77, 77);
        drawKeyboard();
    }

    

    var specialKeySize = 85;
    var keySize = 40;
    drawKeyboard = function()
    {
        for (var k = 0; k < keys.length; k++)
        {
            keys[k].drawLetterKey();
        }

        enterKey.drawEnterKey();
        deleteKey.drawDeleteKey();
    }

    a.mouseClicked = function()
    {
        for (var key of keys)
        {
            key.checkIfLetterClick();
        }
        enterKey.checkIfEnterClick();
        deleteKey.checkIfDeleteClick();
        console.log(currentEntry);
        console.log(guesses);
    }

    class Key
    {
        constructor(x, y, w, h)
        {
            this.x = x
            this.y = y
            this.w = w
            this.h = h
        }

        drawKey() {
            a.push();
            a.fill(143, 143, 143);
            a.rect(this.x, this.y, this.w, this.h, 10);
            a.pop();
        }

        checkIfClick() {
            if (a.mouseX >= this.x && a.mouseX <= this.x + this.w && a.mouseY > this.y && a.mouseY < this.y + this.h)
            {
                return true;
            }
            return false;
        }
    }

    // -1 = wrong
    //  0 = neutral
    //  1 = yellow
    //  2 = green

    class LetterKey extends Key
    {
        constructor(x, y, w, h, letter, state)
        {
            super(x, y, w, h)
            this.letter = letter
            this.state = state
        }

        drawLetterKey()
        {
            this.drawKey();
            a.push()
            a.fill(0);
            a.textSize(20);
            a.textAlign(a.CENTER, a.CENTER);
            a.text(this.letter, this.x + this.w/2, this.y + this.h/2);
            a.pop()
        }

        checkIfLetterClick()
        {
            if (this.checkIfClick())
            {
                if (currentEntry.length < 5)
                {
                    currentEntry += this.letter;
                }
            }
        }
    }

    class EnterKey extends Key
    {
        constructor(x, y, w, h)
        {
            super(x, y, w, h)
        }

        drawEnterKey()
        {
            this.drawKey();
            a.push()
            a.fill(0);
            a.textSize(20);
            a.textAlign(a.CENTER, a.CENTER);
            a.text("ENTER", this.x + this.w/2, this.y + this.h/2);
            a.pop()
        }

        checkIfEnterClick()
        {
            if (this.checkIfClick())
            {
                console.log("enter")
                guesses[whatGuessAreWeOn] = currentEntry;
                whatGuessAreWeOn++;
                currentEntry = "";
            }
        }
    }

    class DeleteKey extends Key
    {
        constructor(x, y, w, h)
        {
            super(x, y, w, h)
        }

        drawDeleteKey()
        {
            this.drawKey();
            a.push()
            a.fill(0);
            a.textSize(20);
            a.textAlign(a.CENTER, a.CENTER);
            a.text("⌫", this.x + this.w/2, this.y + this.h/2);
            a.pop()
        }

        checkIfDeleteClick()
        {
            if (this.checkIfClick())
            {
                currentEntry = currentEntry.slice(0, -1);
            }
        }
    }
}



var copycatP5 = new p5(copycat, "sketch")