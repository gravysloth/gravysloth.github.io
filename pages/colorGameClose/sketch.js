let targetCircle
let targetColor

let changeCircle
let changeColor

let baseCircles = []

let threshold = 0.2

let granularity = 50
let rgbRandom
let rgb = ["red", "yellow", "blue"]
let rgbChanges = [0, 0, 0]

let outputText = "select color"

let resetButton, textColor

let redColor, yellowColor, blueColor

function setup() {
  var canvas = createCanvas(600, 800)
  canvas.parent("sketch")
  frameRate(30)
  noStroke()

  textAlign(CENTER, CENTER)
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

  resetButton = new Button(createVector(width / 2 - 50, 500), 100, 50, color(255), "done")
  targetCircle = new ColorCircle(createVector(150, 150), 200, targetColor, "target")
  changeCircle = new ColorCircle(createVector(450, 150), 200, changeColor, "change")
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
  // targetColor = averageColor(changeColor, baseCircles[rgbRandom].color)
  targetCircle.color = getRandomColor()
  // changeCircle.color = getRandomColor()
  changeCircle.color = color(0, 0, 255)
  textColor = color(255)
  outputText = "select color"
}

function averageColor(originalColor, averageColor) {
  // let newColor = color(
  //   (red(originalColor) + red(averageColor)*threshold)/(1+threshold),
  //   (green(originalColor) + green(averageColor)*threshold)/(1+threshold),
  //   (blue(originalColor) + blue(averageColor)*threshold)/(1+threshold))
  let newColor = color(
    (red(originalColor) + red(averageColor)*0.2)*0.2,
    (green(originalColor) + green(averageColor)*0.2)*0.2,
    (blue(originalColor) + blue(averageColor)*0.2)*0.2)
  return newColor
}

function mouseClicked() {
  checkMouseWithinCircle(targetCircle)
  for (let i = 0; i < baseCircles.length; i++) {
    if (checkMouseWithinCircle(baseCircles[i])) {
      console.log(i)
      changeCircle.color = averageColor(changeCircle.color, baseCircles[i].color)
      console.log(red(changeCircle.color), green(changeCircle.color), blue(changeCircle.color))
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
  let num = floor(255/granularity)
  return color(
    getRandomInt(0, num)*granularity,
    getRandomInt(0, num)*granularity,
    getRandomInt(0, num)*granularity)
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
  constructor(position, size, color, label) {
    this.position = position
    this.size = size
    this.color = color
    this.label = label
  }

  draw() {
    push()
    fill(this.color)
    circle(this.position.x, this.position.y, this.size)
    pop()
    push()
    fill(textColor)
    textSize(16)
    text(this.label, this.position.x, this.position.y + this.size/2 + 20)
    pop()
  }
}
