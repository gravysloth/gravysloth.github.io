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

function setup() {
  var canvas = createCanvas(600, 600)
  canvas.parent("sketch")
  frameRate(30)
  noStroke()

  for (let i = 0; i < 3; i++) {
    let colorBase = [0, 0, 0]
    colorBase[i] = 255
    baseCircles.push(new ColorCircle(
      createVector(150 * i + 150, 350),
      100,
      color(colorBase)))
  }

  targetColor = getRandomColor()
  targetCircle = new ColorCircle(createVector(450, 150), 200, targetColor)
  let targetColorArray = [red(targetColor), green(targetColor), blue(targetColor)]
  rgbRandom = getRandomInt(0, 2)
  targetColorArray[rgbRandom] -= threshold
  changeColor = color(targetColorArray[0], targetColorArray[1], targetColorArray[2])
  changeCircle = new ColorCircle(createVector(150, 150), 200, changeColor)
}

function draw() {
  background(24, 24, 26)
  changeCircle.draw()
  targetCircle.draw()
  for (let i = 0; i < baseCircles.length; i++) {
    baseCircles[i].draw()
  }
}

function mouseClicked() {
  checkMouseWithinCircle(targetCircle)
  for (let i = 0; i < baseCircles.length; i++) {
    if (checkMouseWithinCircle(baseCircles[i])) {
      if (i == rgbRandom) {
        console.log("YESSSS")
        console.log("It was " + rgb[rgbRandom])
      } else {
        console.log("NOOO")
        console.log("It's actually " + rgb[rgbRandom])
      }
    }
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
    console.log("rect")
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
  constructor(position, width, height, color) {
    this.position = position
    this.width = width
    this.height = height
    this.color = color
  }

  draw() {
    push()
    fill(this.color)
    rect(this.position.x, this.position.y, this.width, this.height)
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