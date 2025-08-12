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

function preload() {
    wordsString = loadStrings("words/words.txt");
}

function setup() {
    let rand = floor(random(wordsString.length));
    word = wordsString[rand].toUpperCase();
    debugText = rand;

    var canvas = createCanvas(600, 600);
    canvas.parent("sketch");
    frameRate(30);

    for (var r = 0; r < QWERTY.length; r++) {
        for (var k = 0; k < QWERTY[r].length; k++) {
            keys.push(new LetterKey(width / 2 - QWERTY[r].length * (keySizeW + keySpacing) / 2 + k * (keySizeW + keySpacing), 425 + (keySizeH + keySpacing) * r, keySizeW, keySizeH, QWERTY[r][k], 0))
        }
    }
    enterKey = new EnterKey(width / 2 - QWERTY[2].length * (keySizeW + keySpacing) / 2 - specialKeySize - keySpacing, 425 + (keySizeH + keySpacing) * 2, specialKeySize, keySizeH);

    deleteKey = new DeleteKey(width / 2 + QWERTY[2].length * (keySizeW + keySpacing) / 2, 425 + (keySizeH + keySpacing) * 2, specialKeySize, keySizeH)

    for (var y = 0; y < 6; y++) {
        for (var x = 0; x < 5; x++) {
            letterBoxes[y].push(new LetterBox(width / 2 - 5 * (letterBoxW + boxSpacing) / 2 + x * (letterBoxW + boxSpacing), y * (letterBoxH + boxSpacing) + 30, letterBoxW, letterBoxH));
        }
    }
}

function draw() {
    background(77, 77, 77);
    drawKeyboard();
    drawLetterBoxes();
    drawEntry()

    push()
    fill(255, 195, 161)
    textSize(20);
    text(debugText, 10, 20);
    pop()

    if (!game) {
        drawResults();
    }
}

function keyTyped() {
    if (keyCode >= 65 && keyCode <= 90) {
        addLetter(key.toUpperCase());
    }
}

function keyPressed() {
    if (keyCode == 8) {
        deleteClicked();
    }
    else if (keyCode == 13) {
        enterClicked();
    }
}

drawResults = function () {
    console.log(won)
    if (won == 1) {
        push()
        noStroke()
        fill(98, 166, 124, 150)
        rect(50, 200, width - 100, height - 400, 10)
        fill(255)
        textSize(80)
        textAlign(CENTER, CENTER)
        text("YOU WON", width / 2, height / 2)
        textSize(15)
        text("reload to play again. I don't want to code a restart button", width / 2, height / 2 + 60)
        pop()
    }
    else {
        push()
        noStroke()
        fill(161, 40, 31, 150)
        rect(50, 200, width - 100, height - 400, 10)
        fill(255)
        textSize(80)
        textAlign(CENTER, CENTER)
        text("YOU LOST", width / 2, height / 2)
        textSize(15)
        text("reload to play again. I don't want to code a restart button", width / 2, height / 2 + 55)
        textSize(15)
        text(word + ", the word was " + word, width / 2, height / 2 + 80)
        pop()
    }
}

drawEntry = function () {
    push()
    fill(255);
    textAlign(CENTER, CENTER)
    textSize(30)
    for (var l = 0; l < currentEntry.length; l++) {
        text(currentEntry[l], width / 2 - (letterBoxW + boxSpacing) * 2.5 + l * (letterBoxW + boxSpacing) + letterBoxW / 2, whatGuessAreWeOn * (letterBoxW + boxSpacing) + 30 + letterBoxH / 2 + 2)
    }
    pop()
}

drawLetterBoxes = function () {
    for (var y = 0; y < letterBoxes.length; y++) {
        for (var x = 0; x < letterBoxes[y].length; x++) {
            letterBoxes[y][x].drawLetterBox();
        }
    }
}

class LetterBox {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.letter = ""
        this.state = 0;
    }

    getLetter() {
        return this.letter;
    }

    setLetter(letter) {
        this.letter = letter;
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }

    drawLetterBox() {
        push();
        if (this.state == -1) {
            fill(50);
        }
        else if (this.state == 0) {
            //fill(140, 140, 140);
            noFill();
        }
        else if (this.state == 1) {
            fill(176, 155, 0);
        }
        else if (this.state == 2) {
            fill(15, 176, 0);
        }
        rect(this.x, this.y, this.w, this.h, 5);
        pop()

        push()
        fill(255);
        textAlign(CENTER, CENTER)
        textSize(30)
        text(this.letter, this.x + this.w / 2, this.y + this.h / 2 + 2)
        pop();
    }
}

drawKeyboard = function () {
    for (var k = 0; k < keys.length; k++) {
        keys[k].drawLetterKey();
    }

    enterKey.drawEnterKey();
    deleteKey.drawDeleteKey();
}

mouseClicked = function () {
    if (game) {
        for (var key of keys) {
            key.checkIfLetterClick();
        }
        enterKey.checkIfEnterClick();
        deleteKey.checkIfDeleteClick();
    }
}

class Key {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    drawKey() {
        push();
        fill(140, 140, 140);
        rect(this.x, this.y, this.w, this.h, 10);
        pop();
    }

    drawKeyState(state) {
        push();
        if (this.state == -1) {
            fill(50);
        }
        else if (this.state == 0) {
            fill(140, 140, 140);
            //noFill();
        }
        else if (this.state == 1) {
            fill(176, 155, 0);
        }
        else if (this.state == 2) {
            fill(15, 176, 0);
        }
        rect(this.x, this.y, this.w, this.h, 10);
        pop();
    }

    checkIfClick() {
        if (mouseX >= this.x && mouseX <= this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            return true;
        }
        return false;
    }
}

// -1 = wrong
//  0 = neutral
//  1 = yellow
//  2 = green

class LetterKey extends Key {
    constructor(x, y, w, h, letter, state) {
        super(x, y, w, h)
        this.letter = letter
        this.state = state
    }

    setState(state) {
        this.state = state;
    }

    drawLetterKey() {
        this.drawKeyState(this.state)
        push()
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(this.letter, this.x + this.w / 2, this.y + this.h / 2);
        pop()
    }

    checkIfLetterClick() {
        if (this.checkIfClick()) {
            addLetter(this.letter);
        }
    }
}

class EnterKey extends Key {
    constructor(x, y, w, h) {
        super(x, y, w, h)
    }

    drawEnterKey() {
        this.drawKey();
        push()
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("ENTER", this.x + this.w / 2, this.y + this.h / 2);
        pop()
    }

    checkIfEnterClick() {
        if (this.checkIfClick()) {
            enterClicked();
        }
    }
}

checkIfWon = function () {
    console.log(letterBoxes)
    var totalRight = 0;
    for (var i = 0; i < 5; i++) {
        if (letterBoxes[whatGuessAreWeOn - 1][i].getState() == 2) {
            totalRight += 1;
        }
    }
    if (totalRight == 5) {
        return true
    }
    else {
        return false
    }
}

class DeleteKey extends Key {
    constructor(x, y, w, h) {
        super(x, y, w, h)
    }

    drawDeleteKey() {
        this.drawKey();
        push()
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("⌫", this.x + this.w / 2, this.y + this.h / 2);
        pop()
    }

    checkIfDeleteClick() {
        if (this.checkIfClick()) {
            deleteClicked()
        }
    }
}

addLetter = function (letter) {
    if (currentEntry.length < 5) {
        currentEntry += letter;
    }
}

deleteClicked = function () {
    currentEntry = currentEntry.slice(0, -1);
}

enterClicked = function () {
    guesses[whatGuessAreWeOn] = currentEntry;
    for (var l = 0; l < currentEntry.length; l++) {
        letterBoxes[whatGuessAreWeOn][l].setLetter(currentEntry[l])
        if (word.includes(currentEntry[l])) {
            if (word[l] == currentEntry[l]) {
                letterBoxes[whatGuessAreWeOn][l].setState(2)
                dict[currentEntry[l]] = 2
            }
            else {
                letterBoxes[whatGuessAreWeOn][l].setState(1)
                if (dict[currentEntry[l]] != 2) {
                    dict[currentEntry[l]] = 1
                }
            }
        }
        else {
            dict[currentEntry[l]] = -1
            letterBoxes[whatGuessAreWeOn][l].setState(-1)
        }
        for (var k = 0; k < keys.length; k++) {
            if (keys[k].letter == currentEntry[l]) {
                keys[k].setState(dict[currentEntry[l]])
            }
        }
    }
    whatGuessAreWeOn++;
    currentEntry = "";

    if (whatGuessAreWeOn > 5) {
        console.log(letterBoxes)
        game = false;
        if (checkIfWon()) {
            won = 1
        }
        else {
            won = -1
        }
    }
    else {
        if (checkIfWon()) {
            won = 1
            game = false
        }
    }
}

// var copycatP5 = new p5(copycat, "sketch")