var wordsString;

var QWERTY = [["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
["A", "S", "D", "F", "G", "H", "J", "K", "L"],
["Z", "X", "C", "V", "B", "N", "M"]];

var dict = {};

var specialKeySize = 85;
var keySizeW = 35;
var keySizeH = 50;
var keySpacing = 4;
var keys = [];
var enterKey;
var deleteKey;
var currentEntry = "";
var guesses = [[""], [""], [""], [""], [""], [""]]
var letterBoxes = [[], [], [], [], [], []];
var letterBoxW = 55;
var letterBoxH = 55;
var boxSpacing = 5;
var whatGuessAreWeOn = 0;
var word = "TOAST"

var debugText = "help"

var game = true;
var won = 0;

var copycat = function(a)
{
    a.preload = function()
    {
        wordsString = a.loadStrings("words/words.txt");
    }

    a.setup = function()
    {
        let rand = a.floor(a.random(wordsString.length));
        word = wordsString[rand].toUpperCase();
        debugText = rand;

        var canvas = a.createCanvas(600, 600);
        canvas.parent("sketch");
        a.frameRate(30);

        for (var r = 0; r < QWERTY.length; r++)
        {
            for (var k = 0; k < QWERTY[r].length; k++)
            {
                keys.push(new LetterKey(a.width/2 - QWERTY[r].length*(keySizeW + keySpacing)/2 + k*(keySizeW + keySpacing), 425 + (keySizeH + keySpacing)*r, keySizeW, keySizeH, QWERTY[r][k], 0))
            }
        }
        enterKey = new EnterKey(a.width/2 - QWERTY[2].length*(keySizeW + keySpacing)/2 - specialKeySize - keySpacing, 425 + (keySizeH + keySpacing)*2, specialKeySize, keySizeH);

        deleteKey = new DeleteKey(a.width/2 + QWERTY[2].length*(keySizeW + keySpacing)/2, 425 + (keySizeH + keySpacing)*2, specialKeySize, keySizeH)

        for (var y = 0; y < 6; y++)
        {
            for (var x = 0; x < 5; x++)
            {
                letterBoxes[y].push(new LetterBox(a.width/2 - 5*(letterBoxW + boxSpacing)/2 + x*(letterBoxW + boxSpacing), y*(letterBoxH + boxSpacing) + 30, letterBoxW, letterBoxH));
            }
        }
    }

    a.draw = function()
    {
        a.background(77, 77, 77);
        drawKeyboard();
        drawLetterBoxes();
        drawEntry()

        a.push()
        a.fill(255, 195, 161)
        a.textSize(20);
        a.text(debugText, 10, 20);
        a.pop()

        if (!game)
        {
            drawResults();
        }
    }

    drawResults = function()
    {
        console.log(won)
        if (won == 1)
        {
            a.push()
            a.noStroke()
            a.fill(98, 166, 124, 150)
            a.rect(50, 200, a.width - 100, a.height - 400, 10)
            a.fill(255)
            a.textSize(80)
            a.textAlign(a.CENTER, a.CENTER)
            a.text("YOU WON", a.width/2, a.height/2)
            a.textSize(15)
            a.text("reload to play again. I don't want to code a restart button", a.width/2, a.height/2 + 60)
            a.pop()
        }
        else
        {
            a.push()
            a.noStroke()
            a.fill(166, 103, 98, 150)
            a.rect(50, 200, a.width - 100, a.height - 400, 10)
            a.fill(255)
            a.textSize(80)
            a.textAlign(a.CENTER, a.CENTER)
            a.text("YOU LOST", a.width/2, a.height/2)
            a.textSize(15)
            a.text("reload to play again. I don't want to code a restart button", a.width/2, a.height/2 + 55)
            a.textSize(15)
            a.text(word + ", the word was " + word, a.width/2, a.height/2 + 80)
            a.pop()
        }
    }

    drawEntry = function()
    {
        a.push()
        a.fill(255);
        a.textAlign(a.CENTER, a.CENTER)
        a.textSize(30)
        for (var l = 0; l < currentEntry.length; l++)
        {
            a.text(currentEntry[l], a.width/2 - (letterBoxW + boxSpacing)*2.5 + l*(letterBoxW + boxSpacing) + letterBoxW/2, whatGuessAreWeOn*(letterBoxW + boxSpacing) + 30 + letterBoxH/2 + 2)
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
        if (game)
        {
            for (var key of keys)
            {
                key.checkIfLetterClick();
            }
            enterKey.checkIfEnterClick();
            deleteKey.checkIfDeleteClick();
        }
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

                if (whatGuessAreWeOn > 5)
                {
                    console.log(letterBoxes)
                    game = false;
                    if (checkIfWon())
                    {
                        won = 1
                    }
                    else
                    {
                        won = -1
                    }
                }
                else
                {
                    if (checkIfWon())
                    {
                        won = 1
                        game = false
                    }
                }
            }
        }
    }

    checkIfWon = function()
    {
        console.log(letterBoxes)
        var totalRight = 0;
        for (var i = 0; i < 5; i++)
        {
            if (letterBoxes[whatGuessAreWeOn-1][i].getState() == 2)
            {
                totalRight += 1;
            }
        }
        if (totalRight == 5)
        {
            return true
        }
        else
        {
            return false
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