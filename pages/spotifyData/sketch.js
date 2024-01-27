
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

  lbp = createVector(0 - lbs / 2, 0 - lbs / 2)
  lg = createVector(0, 1)
  lcp = createVector(lbp.x + lbs / 2, lbp.y + lbs / 10)
  lcv = createVector(0, 0)
}

function draw() {
  background(24, 24, 26)

  if (isDataDone) {
    rect(10, 20, 30, 40)
  } else {
    loading()
  }
}

function mouseClicked() {
  if (!isDataDone) {
    lg.rotate(180)
    canvasRotate -= 180
  }
}

var lcp, lcv
var lcr = 5
var lg

var lbp
var lbs = 100

var canvasRotate = 0
var currCanvasRotate = 0

function loading() {
  doBounce()
  let lerpRotate = lerp(currCanvasRotate, canvasRotate, 0.1)
  currCanvasRotate = lerpRotate

  push()
  translate(width/2, height/2)
  rotate(currCanvasRotate)
  push()
  noFill()
  strokeWeight(4)
  stroke('#8793ff')
  rect(lbp.x, lbp.y, lbs, lbs, 5)
  pop()

  push()
  fill('#aa74ff')
  ellipseMode(RADIUS)
  circle(lcp.x, lcp.y, lcr)
  pop()
  pop()
}

function doBounce() {
  if (frameCount % 90 == 0 ) {
    lg.rotate(45)
    canvasRotate -= 45
  }

  // bounce
  if (lcp.x >= lbp.x + lbs - lcr || lcp.x <= lbp.x + lcr) {
    lcv.x = -lcv.x
  }
  if (lcp.y >= lbp.y + lbs - lcr || lcp.y <= lbp.y + lcr) {
    lcv.y = -lcv.y
  }

  // gravity
  lcv.add(lg)

  // move
  lcp.add(lcv)

  // correct
  if (lcp.x > lbp.x + lbs - lcr) {
    lcp.x = lbp.x + lbs - lcr
  }
  if (lcp.x < lbp.x + lcr) {
    lcp.x = lbp.x + lcr
  }
  if (lcp.y > lbp.y + lbs - lcr) {
    lcp.y = lbp.y + lbs - lcr
  }
  if (lcp.y < lbp.y + lcr) {
    lcp.y = lbp.y + lcr
  }
}