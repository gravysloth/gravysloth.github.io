let targetCircle
let targetColor

let changeCircle
let changeColor

let baseCircles = []

let threshold = 0.2

let rgbRandom
let rgb = ["red", "yellow", "blue"]

let outputText = "select color"

let resetButton, textColor

let redColor, yellowColor, blueColor

function setup() {
  var canvas = createCanvas(600, 600)
  canvas.parent("sketch")
  frameRate(30)
  noStroke()

  textColor = color(255)
  redColor = color(255, 0, 0)
  yellowColor = color(255, 255, 0)
  blueColor = color(0, 0, 255)
  baseCircles.push(new ColorCircle(
    createVector(150, 350),
    100,
    redColor))
  baseCircles.push(new ColorCircle(
    createVector(300, 350),
    100,
    yellowColor))
  baseCircles.push(new ColorCircle(
    createVector(450, 350),
    100,
    blueColor))

  resetButton = new Button(createVector(width / 2 - 50, 500), 100, 50, color(255), "NEXT")
  targetCircle = new ColorCircle(createVector(450, 150), 200, targetColor)
  changeCircle = new ColorCircle(createVector(150, 150), 200, changeColor)
  resetGame()
}

function draw() {
  background(0)
  changeCircle.draw()
  targetCircle.draw()
  for (let i = 0; i < baseCircles.length; i++) {
    baseCircles[i].draw()
  }
  resetButton.draw()

  push()
  fill(textColor)
  textSize(16)
  textAlign(CENTER)
  text(outputText, width / 2, height - 150)
  pop()
}

function resetGame() {
  changeColor = getRandomColor()
  rgbRandom = getRandomInt(0, 2)
  targetColor = averageColor(changeColor, baseCircles[rgbRandom].color)
  targetCircle.color = targetColor
  changeCircle.color = changeColor
  textColor = color(255)
  outputText = "select color"
}

function averageColor(originalColor, averageColor) {
  let newColor = color(
    (red(originalColor) + red(averageColor)*threshold)/(1+threshold),
    (green(originalColor) + green(averageColor)*threshold)/(1+threshold),
    (blue(originalColor) + blue(averageColor)*threshold)/(1+threshold))
  return newColor
}

function resetGameOld() {
  targetColor = getRandomColor()
  let targetColorArray = [red(targetColor), green(targetColor), blue(targetColor)]
  rgbRandom = getRandomInt(0, 2)
  targetColorArray[rgbRandom] -= threshold
  changeColor = color(targetColorArray[0], targetColorArray[1], targetColorArray[2])
  targetCircle.color = targetColor
  changeCircle.color = changeColor
  outputText = "select color"
}

function mouseClicked() {
  checkMouseWithinCircle(targetCircle)
  for (let i = 0; i < baseCircles.length; i++) {
    if (checkMouseWithinCircle(baseCircles[i])) {
      textColor = baseCircles[rgbRandom].color
      if (i == rgbRandom) {
        outputText = "YESSSS! It was " + rgb[rgbRandom]
      } else {
        outputText = "NOOO. It's actually " + rgb[rgbRandom]
      }
    }
  }
  if (checkMouseWithinButton(resetButton)) {
    resetGame()
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
    getRandomInt(0, 255),
    getRandomInt(0, 255),
    getRandomInt(0, 255))
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
    text(this.buttonText, this.position.x + this.width / 2, this.position.y + this.height / 2)
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
