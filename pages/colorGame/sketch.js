function preload() {
}

let targetCircle
let targetColor

let changeCircle
let changeColor

let baseCircles = []

let threshold = 10

let rgbRandom
let rgb = ["red", "green", "blue"]

let outputText = "select color"

let resetButton

function setup() {
  var canvas = createCanvas(600, 600)
  canvas.parent("sketch")
  frameRate(30)
  noStroke()

  resetButton = new Button(createVector(width/2 - 50, 500), 100, 50, color(255), "NEXT")
  for (let i = 0; i < 3; i++) {
    let colorBase = [0, 0, 0]
    colorBase[i] = 255
    baseCircles.push(new ColorCircle(
      createVector(150 * i + 150, 350),
      100,
      color(colorBase)))
  }
  targetCircle = new ColorCircle(createVector(450, 150), 200, targetColor)
  changeCircle = new ColorCircle(createVector(150, 150), 200, changeColor)
  resetGame()
}

function draw() {
  background(24, 24, 26)
  changeCircle.draw()
  targetCircle.draw()
  for (let i = 0; i < baseCircles.length; i++) {
    baseCircles[i].draw()
  }
  resetButton.draw()

  push()
  fill(255)
  textSize(16)
  textAlign(CENTER)
  text(outputText, width / 2, height - 150)
  pop()
}

function resetGame() {
  targetColor = getRandomColor()
  let targetColorArray = [red(targetColor), green(targetColor), blue(targetColor)]
  rgbRandom = getRandomInt(0, 2)
  targetColorArray[rgbRandom] -= threshold
  changeColor = color(targetColorArray[0], targetColorArray[1], targetColorArray[2])
  targetCircle.color = targetColor
  changeCircle.color = changeColor
}

function mouseClicked() {
  checkMouseWithinCircle(targetCircle)
  for (let i = 0; i < baseCircles.length; i++) {
    if (checkMouseWithinCircle(baseCircles[i])) {
      if (i == rgbRandom) {
        outputText = "YESSSS! It was " + rgb[rgbRandom]
      } else {
        outputText = "NOOO. It's actually " + rgb[rgbRandom]
      }
    }
  }
  if (checkMouseWithinButton(resetButton)) {
    resetGame()
    console.log("yes")
  }
}

function checkMouseWithinCircle(ColorCircle) {
  if (ColorCircle.position.dist(createVector(mouseX, mouseY)) < ColorCircle.size / 2) {
    return true
  } else {
    return false
  }
}

function checkMouseWithinRect(position, width, height) {
  if ((mouseX > position.x && mouseX < position.x + width)
    && (mouseY > position.y && mouseY < position.y + height)) {
    return true
  } else {
    return false
  }
}

function checkMouseWithinButton(button) {
  if ((mouseX > button.position.x && mouseX < button.position.x + button.width)
    && (mouseY > button.position.y && mouseY < button.position.y + button.height)) {
    return true
  } else {
    return false
  }
}

function getRandomColor() {
  return color(
    getRandomInt(threshold, 255 - threshold),
    getRandomInt(threshold, 255 - threshold),
    getRandomInt(threshold, 255 - threshold))
}

function getRandomInt(min, max) {
  return Math.round(random(min, max))
}

class Button {
  constructor(position, width, height, color, buttonText) {
    this.position = position
    this.width = width
    this.height = height
    this.color = color
    this.buttonText = buttonText
  }

  draw() {
    push()
    fill(this.color)
    rect(this.position.x, this.position.y, this.width, this.height, 5)
    fill(0)
    textAlign(CENTER, CENTER)
    textSize(24)
    text(this.buttonText, this.position.x + this.width/2, this.position.y + this.height/2)
    pop()
  }
}

class ColorCircle {
  constructor(position, size, color) {
    this.position = position
    this.size = size
    this.color = color
  }

  draw() {
    push()
    fill(this.color)
    circle(this.position.x, this.position.y, this.size)
    pop()
  }
}