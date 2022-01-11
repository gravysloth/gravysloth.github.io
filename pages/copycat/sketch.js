var QWERTY = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
["A", "S", "D", "F", "G", "H", "J", "K", "L"],
["Z", "X", "C", "V", "B", "N", "M"]];

var dict = {};

var keys = [];
var enterKey;
var deleteKey;
var currentEntry = "";
var guesses = [[""], [""], [""], [""], [""], [""]]
var letterBoxes = [[], [], [], [], [], []];
var letterBoxW = 55;
var letterBoxH = 55;
var whatGuessAreWeOn = 0;
var word = "TOAST"

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

        for (var y = 0; y < 6; y++)
        {
            for (var x = 0; x < 5; x++)
            {
                letterBoxes[y].push(new LetterBox(a.width/2 - 5*(letterBoxW + 5)/2 + x*(letterBoxW + 5), y*(letterBoxH + 5) + 30, letterBoxW, letterBoxH));
            }
        }
    }

    a.draw = function()
    {
        a.background(77, 77, 77);
        drawKeyboard();
        drawLetterBoxes();
        drawEntry()
    }

    drawEntry = function()
    {
        a.push()
        a.fill(255);
        a.textAlign(a.CENTER, a.CENTER)
        a.textSize(30)
        for (var l = 0; l < currentEntry.length; l++)
        {
            a.text(currentEntry[l], a.width/2 - (letterBoxW + 5)*2.5 + l*(letterBoxW + 5) + letterBoxW/2, whatGuessAreWeOn*(letterBoxW + 5) + 30 + letterBoxH/2 + 2)
        }
        a.pop()
    }

    drawLetterBoxes = function()
    {
        for (var y = 0; y < letterBoxes.length; y++)
        {
            for (var x = 0; x < letterBoxes[y].length; x++)
            {
                letterBoxes[y][x].drawLetterBox();
            }
        }
    }

    class LetterBox
    {
        constructor(x, y, w, h)
        {
            this.x = x
            this.y = y
            this.w = w
            this.h = h
            this.letter = ""
            this.state = 0;
        }

        getLetter()
        {
            return this.letter;
        }

        setLetter(letter)
        {
            this.letter = letter;
        }

        getState()
        {
            return this.state;
        }

        setState(state)
        {
            this.state = state;
        }

        drawLetterBox()
        {
            a.push();
            if (this.state == -1)
            {
                a.fill(50);
            }
            else if (this.state == 0)
            {
                // a.fill(140, 140, 140);
                a.noFill();
            }
            else if (this.state == 1)
            {
                a.fill(176, 155, 0);
            }
            else if (this.state == 2)
            {
                a.fill(15, 176, 0);
            }
            a.rect(this.x, this.y, this.w, this.h, 5);
            a.pop()

            a.push()
            a.fill(255);
            a.textAlign(a.CENTER, a.CENTER)
            a.textSize(30)
            a.text(this.letter, this.x + this.w/2, this.y + this.h/2 + 2)
            a.pop();
        }
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
            a.fill(140, 140, 140);
            a.rect(this.x, this.y, this.w, this.h, 10);
            a.pop();
        }

        drawKeyState(state)
        {
            a.push();
            if (this.state == -1)
            {
                a.fill(50);
            }
            else if (this.state == 0)
            {
                a.fill(140, 140, 140);
                // a.noFill();
            }
            else if (this.state == 1)
            {
                a.fill(176, 155, 0);
            }
            else if (this.state == 2)
            {
                a.fill(15, 176, 0);
            }
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

        setState(state)
        {
            this.state = state;
        }

        drawLetterKey()
        {
            this.drawKeyState(this.state)
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
                for (var l = 0; l < currentEntry.length; l++)
                {
                    letterBoxes[whatGuessAreWeOn][l].setLetter(currentEntry[l])
                    if (word.includes(currentEntry[l]))
                    {
                        if (word[l] == currentEntry[l])
                        {
                            letterBoxes[whatGuessAreWeOn][l].setState(2)
                            dict[currentEntry[l]] = 2
                        }
                        else
                        {
                            letterBoxes[whatGuessAreWeOn][l].setState(1)
                            if (dict[currentEntry[l]] != 2)
                            {
                                dict[currentEntry[l]] = 1
                            }
                        }
                    }
                    else
                    {
                        dict[currentEntry[l]] = -1
                        letterBoxes[whatGuessAreWeOn][l].setState(-1)
                    }
                    for (var k = 0; k < keys.length; k++)
                    {
                        if (keys[k].letter == currentEntry[l])
                        {
                            keys[k].setState(dict[currentEntry[l]])
                        }
                    }
                }
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