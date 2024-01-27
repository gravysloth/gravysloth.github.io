
let marqueeData = {}
let streamingData = {}

function preload() {
}

function setup() {
  var canvas = createCanvas(600, 600)
  canvas.parent("sketch")
  frameRate(30)
  angleMode(DEGREES)
  noStroke()

  lg = createVector(0, 1)
  lbp = createVector(0 - lbs / 2, 0 - lbs / 2)
  balls.push(new LoadingBall(lbp.x + lbs / 4, lbp.y + lbs / 2, "#ff7474"))
  balls.push(new LoadingBall(lbp.x + lbs / 2, lbp.y + lbs / 10, "#aa74ff"))
  balls.push(new LoadingBall(lbp.x + lbs * 3 / 4, lbp.y + lbs * 1 / 5, "#6fb86c"))
}

function draw() {
  // background(24, 24, 26)
  background(0)

  if (isDataDone) {
    rect(10, 20, 30, 40)
  } else {
    loading()
  }
}

function mouseClicked() {
  if (!isDataDone) {
    rotateBy *= -1
    lg.rotate(rotateBy * 4)
    canvasRotate -= rotateBy * 4
  }
}

var lg
var lbp
var lbs = 100
var lbw = 5

var canvasRotate = 0
var currCanvasRotate = 0
var rotateBy = 45

let balls = []

function loading() {
  rotateLoader()
  let lerpRotate = lerp(currCanvasRotate, canvasRotate, 0.1)
  currCanvasRotate = lerpRotate

  push()
  translate(width / 2, height / 2)
  rotate(currCanvasRotate)
  push()
  noFill()
  strokeWeight(lbw)
  stroke('#8793ff')
  rect(lbp.x, lbp.y, lbs, lbs, 5)
  pop()

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw()
  }
  pop()
}

function rotateLoader() {
  if (frameCount % 90 == 0) {
    lg.rotate(rotateBy)
    canvasRotate -= rotateBy
  }
}

class LoadingBall {
  constructor(x, y, color) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.r = 5
    this.color = color
  }

  draw() {
    push()
    fill(this.color)
    ellipseMode(RADIUS)
    circle(this.pos.x, this.pos.y, this.r)
    pop()

    this.calculate()
  }

  calculate() {
    // bounce
    if (this.pos.x >= lbp.x + lbs - this.r - lbw / 2 || this.pos.x <= lbp.x + this.r + lbw / 2) {
      this.vel.x = -this.vel.x
    }
    if (this.pos.y >= lbp.y + lbs - this.r - lbw / 2 || this.pos.y <= lbp.y + this.r + lbw / 2) {
      this.vel.y = -this.vel.y
    }

    // gravity
    this.vel.add(lg)

    // friction
    if (this.vel.mag() > 10) {
      this.vel.mult(0.99)
    }
    this.vel.x += 0.1 * (randomGaussian());
    // move
    this.pos.add(this.vel)

    // correct
    if (this.pos.x > lbp.x + lbs - this.r - lbw / 2) {
      this.pos.x = lbp.x + lbs - this.r - lbw / 2
    }
    if (this.pos.x < lbp.x + this.r + lbw / 2) {
      this.pos.x = lbp.x + this.r + lbw / 2
    }
    if (this.pos.y > lbp.y + lbs - this.r - lbw / 2) {
      this.pos.y = lbp.y + lbs - this.r - lbw / 2
    }
    if (this.pos.y < lbp.y + this.r + lbw / 2) {
      this.pos.y = lbp.y + this.r + lbw / 2
    }
  }
}