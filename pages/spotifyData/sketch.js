//
//
//
//
//

let timeSinceStart = 0
let fps = 30

function preload() {
}

function setup() {
  var canvas = createCanvas(600, 600)
  canvas.parent("sketch")
  frameRate(fps)
  angleMode(DEGREES)
  noStroke()

  lg = createVector(0, 1)
  lbp = createVector(0 - lbs / 2, 0 - lbs / 2)
  balls.push(new LoadingBall(lbp.x + lbs / 4, lbp.y + lbs / 2, "#ff7474"))
  balls.push(new LoadingBall(lbp.x + lbs / 2, lbp.y + lbs / 10, "#aa74ff"))
  balls.push(new LoadingBall(lbp.x + lbs * 3 / 4, lbp.y + lbs * 1 / 5, "#6fb86c"))
}

function draw() {
  timeSinceStart += deltaTime

  background(24, 24, 26)
  // background(0)

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
  if (frameCount % (fps * 3) == 0) {
    lg.rotate(rotateBy)
    canvasRotate -= rotateBy
  }
}

class LoadingBall {
  constructor(x, y, c) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.r = 5
    this.c = color(c)
    this.ch = color(c)
    this.history = []
    this.historyLength = 0
  }

  draw() {
    this.calculate()


    if (frameCount % 1 == 0) {
      if (this.history.length < this.historyLength) {
        this.history.push([this.pos.x, this.pos.y])
      } else {
        this.history.shift()
      }
    }

    push()
    ellipseMode(RADIUS)
    for (let i = 0; i < this.history.length; i++) {
      this.ch.setAlpha(map(i, 0, this.history.length, 0, 255))
      fill(this.ch)
      circle(this.history[i][0], this.history[i][1], this.r)
    }
    pop()
    push()
    fill(this.c)
    ellipseMode(RADIUS)
    circle(this.pos.x, this.pos.y, this.r)
    pop()
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
    if (this.vel.mag() > 15) {
      this.vel.mult(0.95)
    }

    // add some random noise
    this.vel.x += 0.1 * randomGaussian();
    this.vel.y += 0.1 * randomGaussian();

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