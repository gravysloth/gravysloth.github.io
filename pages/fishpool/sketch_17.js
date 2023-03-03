let play = false
let bgImg, zippyImg, mouseFriendImg, shrimpyImg
let sound, crunches, squelches, empty
let selection, selected
let repulseDist, alignDist, attractDist, huntDist, limitDist
let repulseDistSq, alignDistSq, attractDistSq, huntDistSq, limitDistSq
let explosions
let mouseMen
let mouseFriends, mouseFriendsNum, mouseFriendsMax
let shrimpys, shrimpysNum, shrimpysMax, shrimpysEaten
let jellys, jellysNum, jellysMax, jellysEaten
let lumens, lumensNum, lumensMax
let simple, algae

let menuX, menuY
let showHelp = true

function preload() {
  bgImg = loadImage("img/bgImgMed.png")
  zippyImg = loadImage("ref/roundZippyLilRED.png")
  mouseFriendImg = loadImage("ref/roundZippyFullRED.png")
  shrimpyImg = loadImage("ref/shrimpyFull.png")

  empty = loadSound("sound/empty.mp4")
  sound = true
  crunches = []
  for (i=0; i < 5; i++) {
    crunches.push(loadSound("sound/crunch_" + i + ".mp4"))
  }
  squelches = []
  for (i=0; i < 3; i++) {
    squelches.push(loadSound("sound/squelch_" + i + ".mp4"))
  }
}

function setup(){
  var canvas = createCanvas(windowWidth, windowHeight)
  canvas.parent("sketch")
  frameRate(60)

  selection = ["MOUSEFRIEND", "SHRIMPY", "JELLY"]
  selected = selection[0]

  menuX = 0
  menuY = 0

  repulseDist = 30
  alignDist = 50
  attractDist = 150
  huntDist = 250
  limitDist = 350

  repulseDistSq = sq(repulseDist)
  alignDistSq = sq(alignDist)
  attractDistSq = sq(attractDist)
  huntDistSq = sq(huntDist)
  limitDistSq = sq(limitDist)

  explosions = []

  shrimpys = []
  shrimpysNum = 50
  shrimpysMax = 200
  shrimpysEaten = 0

  jellys = []
  jellysNum = 3
  jellysMax = 12
  jellysEaten = 0

  mouseFriends = []
  mouseFriendsNum = 1
  mouseFriendsMax = 5

  lumens = []
  lumensMax = 400
  lumensNum = 0

  simple = false
  algae = false

  mouseMen = []
  createMouseMen()

  cursor("img/cursor_0.png")
}

function draw(){
  background(24, 24, 26)
  generateBackground(1.1)

  mouseMen[0].display()

  if (!play) {
    intro()
  } else {
    game()
  }
  menu(menuX, menuY)
  stats(0, 0)
  upDownArrow()

  if (showHelp) {
    help()
  }

  push()
  fill(174, 158, 232)
  textAlign(CENTER)
  textSize(32)
  text("?", width - 50, height - 35)
  pop()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function help() {
  push()
  fill(174, 158, 232)
  textAlign(LEFT)
  textSize(18)
  text("← water size", menuX + 180, menuY + 32)
  text("← lo quality = faster speed", menuX + 150, menuY + 62)
  text("← bioluminescent algae (slows down speed)", menuX + 90, menuY + 122)
  stroke(174, 158, 232)
  strokeWeight(2)
  line(menuX + 140, menuY + 140, menuX + 150, menuY + 140)
  line(menuX + 140, menuY + 285, menuX + 150, menuY + 285)
  line(menuX + 150, menuY + 140, menuX + 150, menuY + 285)
  noStroke()
  text("←", menuX + 160, menuY + 210)
  text("select a critter\nUse arrow keys to change population", menuX + 180, menuY + 200)
  textAlign(RIGHT)
  text("stats →", width - 180, 65)
  text("help →", width - 70, height - 40)
  pop()
}

function intro() {
  rectMode(CENTER)
  fill(6, 6, 41, 100)
  noStroke()
  rect(width/2, height/2, 100, 50, 10)

  textAlign(CENTER)
  fill(255)
  textSize(20)
  text("start", width/2, height/2 + 5)
}

function menu(x, y) {
  let colors = [100, 255]
  let line = 0
  rectMode(CORNER)
  fill(232, 247, 255, 20)
  noStroke()
  textSize(15);
  textAlign(LEFT)
  line = 30
  if (limitDist === 150) {
    fill(colors[1])
    text("teeny", x + 10, y + line)
    fill(colors[0])
    text("medium", x + 60, y + line)
    text("large", x + 130, y + line)
  } else if (limitDist === 250) {
    fill(colors[0])
    text("teeny", x + 10, y + line)
    fill(colors[1])
    text("medium", x + 60, y + line)
    fill(colors[0])
    text("large", x + 130, y + line)
  } else if (limitDist == 350) {
    fill(colors[0])
    text("teeny", x + 10, y + line)
    fill(colors[0])
    text("medium", x + 60, y + line)
    fill(colors[1])
    text("large", x + 130, y + line)
  }
  line = 60
  if (simple) {
    fill(colors[1])
    text("simplified", x + 10, y + line)
    fill(colors[0])
    text("detailed", x + 80, y + line)
  } else {
    fill(colors[0])
    text("simplified", x + 10, y + line)
    fill(colors[1])
    text("detailed", x + 80, y + line)
  }
  line = 90
  fill(colors[1])
  text("sound", x + 10, y + line)
  if (sound) {
    text("on", x + 60, y + line)
  } else {
    fill(colors[0])
    text("off", x + 60, y + line)
  }
  line = 120
  fill(colors[1])
  text("lumen", x + 10, y + line)
  if (algae) {
    text("on", x + 60, y + line)
  } else {
    fill(colors[0])
    text("off", x + 60, y + line)
  }
  // specie select
  line = 160
  imageMode(CORNER)
  image(mouseFriendImg, x, y + line - 20, 40, 40)
  if (selected === selection[0]) {
    fill(colors[1])
  } else {
    fill(colors[0])
  }
  text("zippy × " + mouseFriendsNum, x + 40, y + line)
  line = 210
  imageMode(CORNER)
  image(shrimpyImg, x + 10, y + line - 20, 20, 40)
  if (selected === selection[1]) {
    fill(colors[1])
  } else {
    fill(colors[0])
  }
  text("shrimpy × " + shrimpysNum, x + 40, y + line)
  line = 260
  imageMode(CORNER)
  image(shrimpyImg, x + 10, y + line - 20, 20, 40)
  if (selected === selection[2]) {
    fill(colors[1])
  } else {
    fill(colors[0])
  }
  text("jelly × " + jellysNum, x + 40, y + line)
}

function stats(x, y) {
  let line = 30
  textAlign(CENTER)
  fill(255)
  text("shrimpys eaten", width - 100 + x, line + y)
  text(shrimpysEaten, width - 100 + x, line + 20 + y)
  line = 80
  text("jellys eaten", width - 100 + x, line + y)
  text(jellysEaten, width - 100 + x, line+ 20 + y)
}

function mouseClicked() {
  print(mouseX, mouseY)
  if (!play) {
    if (mouseX > width/2-50 && mouseX < width/2+50 && mouseY > height/2-15 && mouseY < height/2+15) {
      play = true
      showHelp = false
    }
  }
  empty.play()
  print(mouseX, mouseY)
  if (mouseX > width - 55 && mouseX < width - 30 && mouseY > height - 60) {
    showHelp = !showHelp
  }
  if (mouseY > 10 && mouseY < 30) {
    if (mouseX > 10 && mouseX < 45) {
      limitDist = 150
      limitDistSq = sq(limitDist)
    } else if (mouseX > 65 && mouseX < 110) {
      limitDist = 250
      limitDistSq = sq(limitDist)
    } else if (mouseX > 130 && mouseX < 165) {
      limitDist = 350
      limitDistSq = sq(limitDist)
    }
  }
  if (mouseY > 40 && mouseY < 60) {
    if (mouseX > 10 && mouseX < 80) {
      simple = true
    } else {
      simple = false
    }
  }
  if (mouseX > 55 && mouseX < 80 && mouseY > 70 && mouseY < 90) {
    sound = !sound
  }
  if (mouseX > 55 && mouseX < 80 && mouseY > 100 && mouseY < 120) {
    algae = !algae
    if (algae) {
      lumensNum = lumensMax
    } else {
      lumensNum = 0
    }
  }
  if (mouseX < 130) {
    // click mouse friend
    if (mouseY > 140 && mouseY < 170) {
      selected = selection[0]
    }
    // click shrimpy
    if (mouseY > 190 && mouseY < 220) {
      selected = selection[1]
    }
    // click jelly
    if (mouseY > 240 && mouseY < 270) {
      selected = selection[2]
    }
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    changePop(true)
  } else if (keyCode === LEFT_ARROW) {
    changePop(false)
  }
}

function upDownArrow() {
  if (keyIsPressed === true) {
    print(keyCode)
    if (keyCode === UP_ARROW) {
      changePop(true)
    } else if (keyCode === DOWN_ARROW) {
      changePop(false)
    }
  }
}

function changePop(up) {
  if (up) {
    if (selected === "SHRIMPY") {
      shrimpysNum++
    } else if (selected == "JELLY") {
      jellysNum++
    } else if (selected == "MOUSEFRIEND") {
      mouseFriendsNum++
    }
  } else {
    if (selected === "SHRIMPY") {
      shrimpysNum--
    } else if (selected == "JELLY") {
      jellysNum--
    } else if (selected == "MOUSEFRIEND") {
      mouseFriendsNum--
    }
  }
}

function game() {
  if (algae) {
    for (let lumen of lumens) {
      lumen.evalInteractions(lumens, true, false, false, false, false)
      lumen.evalInteractions(shrimpys, true, false, false, false, false);
      lumen.evalInteractions(mouseMen, false, false, false, true, false)
      lumen.keepClose()
      lumen.update()
      lumen.display()
    }
  }
  createLumenAlgae(lumensNum)

  for (let shrimp of shrimpys) {
    shrimp.evalInteractions(shrimpys, true, false, true, false, false);
    shrimp.evalInteractions(mouseMen, false, false, false, true, false)
    shrimp.evalInteractions(mouseFriends, false, false, false, true, false)
    shrimp.keepClose()
    shrimp.update()
    shrimp.display()
  }
  createShrimpys(shrimpysNum)
  if (shrimpysNum < 0) {
    shrimpysNum = 0
  } else if (shrimpysNum > shrimpysMax) {
    shrimpysNum = shrimpysMax
  }

  for (let jelly of jellys) {
    jelly.evalInteractions(jellys, true, false, false, false, false);
    jelly.evalInteractions(mouseMen, false, false, false, true, false)
    jelly.evalInteractions(mouseFriends, false, false, false, true, false)
    jelly.keepClose()
    jelly.update()
    jelly.display()
  }
  createJellys(jellysNum)
  if (jellysNum < 0) {
    jellysNum = 0
  } else if (jellysNum > jellysMax) {
    jellysNum = jellysMax
  }

  for (let friend of mouseFriends) {
    friend.evalInteractions(shrimpys, false, false, false, false, true);
    friend.evalInteractions(jellys, false, false, false, false, true);
    friend.evalInteractions(mouseFriends, true, false, false, false, false)
    friend.keepClose()
    friend.update()
    friend.display()
  }
  createMouseFriends(mouseFriendsNum)
  if (mouseFriendsNum < 0) {
    mouseFriendsNum = 0
  } else if (mouseFriendsNum > mouseFriendsMax) {
    mouseFriendsNum = mouseFriendsMax
  }

  showExplosions()
}

function generateBackground(size) {
  imageMode(CENTER)
  let sizing = size * limitDist * 2
  image(bgImg, width/2, height/2, sizing, sizing)
}

function createShrimpys(n) {
  let oldSize = shrimpys.length

  if (n < oldSize) {
    shrimpys.splice(n, Number.MAX_VALUE)
  } else if (n > oldSize) {
    let i, ang, mag, pos, vel, size

    for (i = oldSize; i < n; i++) {
      ang = TWO_PI * random()
      mag = limitDist * random(0.2, 1)
      pos = createVector(0.5 * width + mag * cos(ang), 0.5 * height + mag * sin(ang))
      ang = TWO_PI * random()
      vel = createVector(cos(ang), sin(ang))
      size = 0.5
      shrimpys[i] = new Shrimpy(pos, vel, size)
    }
  }
  // remove the dead
  for (i=0; i<shrimpys.length; i++) {
    let shrimpy = shrimpys[i]
    if (shrimpy.isClose) {
      explosions.push(new Explosion(shrimpy.pos.x, shrimpy.pos.y))
      shrimpys.splice(i, 1)
      shrimpysNum--
      shrimpysEaten++
      if (sound) {
        playSound("crunch")
      }
    }
  }
}

function createJellys(n) {
  let oldSize = jellys.length
  if (n < oldSize) {
    jellys.splice(n, Number.MAX_VALUE)
  } else if (n > oldSize) {
    let i, ang, mag, pos, vel, size

    for (i = oldSize; i < n; i++) {
      ang = TWO_PI * random()
      mag = limitDist * random(0.2, 1)
      pos = createVector(0.5 * width + mag * cos(ang), 0.5 * height + mag * sin(ang))
      ang = TWO_PI * random()
      vel = createVector(cos(ang), sin(ang))
      size = 0.3
      jellys[i] = new Jelly(pos, vel, size)
    }
  }
  // remove the dead
  for (i=0; i<jellys.length; i++) {
    let jelly = jellys[i]
    if (jelly.isClose) {
      explosions.push(new Explosion(jelly.pos.x, jelly.pos.y))
      jellys.splice(i, 1)
      jellysNum--
      jellysEaten++
      if (sound) {
        playSound("squelch")
      }
    }
  }
}

function createMouseFriends(n) {
  let oldSize = mouseFriends.length
  if (n < oldSize) {
    mouseFriends.splice(n, Number.MAX_VALUE)
  } else if (n > oldSize) {
    let i, ang, mag, pos, vel, size

    for (i = oldSize; i < n; i++) {
      ang = TWO_PI * random()
      mag = limitDist * random(0.2, 1)
      pos = createVector(0.5 * width + mag * cos(ang), 0.5 * height + mag * sin(ang))
      ang = TWO_PI * random()
      vel = createVector(cos(ang), sin(ang))
      size = 30
      mouseFriends[i] = new MouseFriend(pos, vel, size)
    }
  }
}

async function playSound(sound) {
  if (sound === "crunch") {
    random(crunches).play()
  } else if (sound === "squelch") {
    random(squelches).play()
  }
}

function showExplosions() {
  for (i=0; i<explosions.length; i++) {
    let explosion = explosions[i]
    if (explosion.alive) {
      explosion.display()
    } else {
      explosions.splice(i, 1)
    }
  }
}

function createLumenAlgae(n) {
  let oldSize = lumens.length

  if (n < oldSize) {
    lumens.splice(n, Number.MAX_VALUE)
  } else if (n > oldSize) {
    let i, ang, mag, pos, vel, size

    for (i = oldSize; i < n; i++) {
      ang = TWO_PI * random()
      mag = limitDist * random()
      pos = createVector(0.5 * width + mag * cos(ang), 0.5 * height + mag * sin(ang))
      ang = TWO_PI * random()
      vel = createVector(cos(ang), sin(ang))
      size = 15
      lumens[i] = new LumenAlgae(pos, vel, size)
    }
  }
}

function createMouseMen() {
  mouseMen[0] = new MouseMan()
}

class Flock {
  constructor(pos, vel, friction, maxVel, rD) {
    this.pos = pos
    this.vel = vel
    this.friction = friction
    this.repulseDist = rD
    this.force = createVector(0, 0)
    this.isClose = false
    this.forceDir = createVector(0, 0)
    this.maxVelSq = sq(maxVel)
  }

  evalInteractions(flocks, separateCond, alignCond, attractCond, huntedCond, huntCond) {
    let distSq

    for (let flock of flocks) {
      this.forceDir.x = flock.pos.x - this.pos.x
      this.forceDir.y = flock.pos.y - this.pos.y
      distSq = sq(this.forceDir.x) + sq(this.forceDir.y)

      if (separateCond) {
        this.separate(this.forceDir, distSq)
      }

      if (alignCond) {
        this.align(flock.vel, distSq)
      }

      if (attractCond) {
        this.attract(this.forceDir, distSq)
      }

      if (huntedCond) {
        this.hunted(this.forceDir, distSq)
      }

      if (huntCond) {
        this.hunt(this.forceDir, distSq)
      }
    }
  }
  // 1
  separate(forceDir, distSq) {
    if (distSq < repulseDistSq && distSq !== 0) {
      let dist = sqrt(distSq)
      let forceFactor = -(repulseDist / dist - 1) / dist
      this.force.add(forceDir.mult(forceFactor))

      // stroke(0, 255, 0)
      // line(this.pos.x, this.pos.y, this.pos.x + forceDir.x, this.pos.y + forceDir.y)

    }
  }
  // 2
  align(forceDir, distSq) {
    if (distSq > repulseDistSq && distSq < alignDistSq) {
      let dist = sqrt(distSq);
      let forceFactor = 0.01 * (1 - cos(TWO_PI * (dist - this.repulseDist) / (alignDist - this.repulseDist))) / dist
      this.force.add(forceDir.mult(forceFactor))

      stroke(0, 255, 0)
      line(this.pos.x, this.pos.y, this.pos.x + this.forceDir.x, this.pos.y + this.forceDir.y)
    }
  }
  // 3
  attract(fD, distSq) {
    if (distSq > alignDistSq && distSq < attractDistSq) {
      let dist = sqrt(distSq)
      let forceFactor = 0.01 * (1 - cos(TWO_PI * (dist - alignDist) / (attractDist - alignDist))) / dist
      this.force.add(fD.mult(forceFactor))

      // stroke(0, 255, 0)
      // line(this.pos.x, this.pos.y, this.pos.x + fD.x, this.pos.y + fD.y)
    }
  }

  // move away from something hunting them
  hunted(fD, distSq) {
    if (distSq < huntDistSq) {
      let dist = sqrt(distSq)
      let forceFactor = -0.5 * (huntDist / dist - 1) / dist
      this.force.add(fD.mult(forceFactor))

      if (dist < 15) {
        this.isClose = true
      }
    }
  }

  hunt(fD, distSq) {
    if (distSq < huntDistSq) {
      let dist = sqrt(distSq)
      let forceFactor = 0.2 * (huntDist / dist - 1) / dist
      this.force.add(fD.mult(forceFactor))
    }
  }

  keepClose() {
    this.forceDir.x = 0.5 * width - this.pos.x;
    this.forceDir.y = 0.5 * height - this.pos.y;
    let distSq = sq(this.forceDir.x) + sq(this.forceDir.y)

    if (distSq > limitDistSq) {
      let forceFactor = 1 / limitDist
      this.force.add(this.forceDir.mult(forceFactor))
    }
  }

  // update flock position and velocity
  updateCoords() {
    let velMagSq, scaleFactor, ang
    this.vel.x = this.friction * (this.vel.x + this.force.x)
    this.vel.y = this.friction * (this.vel.y + this.force.y)

    // keeps velocity within reasonable limits
    velMagSq = sq(this.vel.x) + sq(this.vel.y)

    if (velMagSq > this.maxVelSq) {
      scaleFactor = sqrt(this.maxVelSq / velMagSq)
      this.vel.x *= scaleFactor
      this.vel.y *= scaleFactor
    } else if (velMagSq < 1) {
      if (velMagSq !== 0) {
        scaleFactor = sqrt(1 / velMagSq)
        this.vel.mult(scaleFactor)
      } else {
        ang = TWO_PI * random()
        this.vel.x = cos(ang)
        this.vel.y = sin(ang)
      }
    }

    // move pos with vel
    this.pos.add(this.vel)

    // reset force
    this.force.mult(0)
  }
}

class Shrimpy extends Flock {
  constructor(pos, vel, size) {
    super(pos, vel, 0.99, 5, repulseDist);
    this.size = size
    this.colors = [[90, 141, 237], [90, 176, 237], [111, 168, 209], [109, 167, 209]]
    this.color = [255, 0, 0]
    this.randomColor()
  }

  randomColor() {
    this.color = random(this.colors)
  }

  update() {
    this.updateCoords()
  }

  display() {
    let size = this.size
    let opacity = 100
    if (simple) {
      fill(this.color[0], this.color[1], this.color[2], 150 + opacity)
      push()
      translate(this.pos.x, this.pos.y)
      rotate(HALF_PI + atan2(this.vel.y, this.vel.x))
      noStroke()
      rectMode(CENTER)
      rect(0, 10, 4, 20)
      pop()
    } else {
      push()
      fill(this.color[0], this.color[1], this.color[2], 80 + opacity)
      noStroke()
      translate(this.pos.x, this.pos.y)
      rotate(HALF_PI + atan2(this.vel.y, this.vel.x))
      beginShape()
      vertex(-8*size, 0)
      bezierVertex(-8*size, 0, -7*size, -8*size, 0, -8*size)
      bezierVertex(7*size, -8*size, 8*size, 0, 8*size, 0)
      vertex(2*size, 30*size)
      vertex(-2*size, 30*size)
      endShape()

      // antennae
      noFill()
      stroke(90, 141, 237, 80 + opacity)
      strokeWeight(1*size)
      beginShape()
      vertex(-13*size, -10*size)
      vertex(-12*size, -8*size)
      vertex(-5*size, -5*size)
      endShape()
      beginShape()
      vertex(13*size, -10*size)
      vertex(12*size, -8*size)
      vertex(5*size, -5*size)
      endShape()

      //tail
      noStroke()
      fill(245, 182, 163, 60 + opacity)
      beginShape()
      vertex(2*size, 20*size)
      bezierVertex(2*size, 20*size, 15*size, 30*size, 4*size, 35*size)
      bezierVertex(4*size, 35*size, 2*size, 34*size, -1*size, 30*size)
      endShape()
      beginShape()
      vertex(-2*size, 20*size)
      bezierVertex(-2*size, 20*size, -15*size, 30*size, -4*size, 35*size)
      bezierVertex(-4*size, 35*size, -2*size, 34*size, 1*size, 30*size)
      endShape()

      fill("#222627")
      circle(-2*size, -6*size, 2*size)
      circle(2*size, -6*size, 2*size)
      fill("#BAAEA9")
      circle(-1.5*size, -7*size, 0.5*size)
      circle(2.5*size, -7*size, 0.5*size)
      pop()
    }
  }
}

class Jelly extends Flock {
  constructor(pos, vel, size) {
    super(pos, vel, 0.99, 4.5, repulseDist);
    this.size = size
    this.arms = []
    this.nArms = 3
    this.ang = 0
    this.offsetY = 50*this.size
    for (let i=0; i < this.nArms; i++) {
      this.arms[i] = new Arm(this.pos, 80*size/this.nArms*i - 25*size, this.offsetY, this.ang, this.size)
    }
  }

  update() {
    this.updateCoords()
  }

  display() {
    this.ang = HALF_PI + atan2(this.vel.y, this.vel.x)

    if (!simple) {
      for (let arm of this.arms) {
        arm.update(this.ang)
      }
    }

    let size = this.size
    let x = 400
    let y = this.pos.y
    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.ang)

    fill(166, 220, 222, 50)
    noStroke()
    // bell
    beginShape()
      vertex(40*size, 60*size)
      quadraticVertex(100*size, -40*size, 0, -60*size)
      vertex(0, -60*size)
      quadraticVertex(-100*size, -40*size, -40*size, 60*size)
      vertex(-40*size, 60*size)
      quadraticVertex(0, 40*size, 40*size, 60*size)
    endShape()
    if (!simple) {
      // lines
      noFill()
      strokeWeight(10 * size)
      stroke(166, 220, 222, 80)
      beginShape()
      vertex(40 * size, 60 * size)
      quadraticVertex(100 * size, -40 * size, 0, -60 * size)
      vertex(0, -60 * size)
      quadraticVertex(-100 * size, -40 * size, -40 * size, 60 * size)
      endShape()
      beginShape()
      vertex(20 * size, 60 * size)
      quadraticVertex(60 * size, -40 * size, 0, -55 * size)
      vertex(0, -55 * size)
      quadraticVertex(-60 * size, -40 * size, -20 * size, 60 * size)
      endShape()
    }
    pop()
  }
}

class Arm {
  constructor(pos, offsetX, offsetY, ang, size) {
    this.links = random(3, 5)
    this.size = size
    this.segLength = 30*size
    this.pos = pos
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.ang = ang
    this.x = []
    this.y = []
    for (let i = 0; i < this.links; i++) {
      this.x[i] = 0;
      this.y[i] = 0;
    }
  }

  update(ang) {
    this.ang = ang
    let shiftX = this.offsetY*sin(-ang) + this.offsetX*cos(ang)
    let shiftY = this.offsetY*cos(-ang) + this.offsetX*sin(ang)
    this.dragSegment(0, this.pos.x + shiftX, this.pos.y + shiftY);
    for (let i = 0; i < this.x.length - 1; i++) {
      this.dragSegment(i + 1, this.x[i], this.y[i]);
    }
  }

  dragSegment(i, xin, yin) {
    const dx = xin - this.x[i];
    const dy = yin - this.y[i];
    const angle = atan2(dy, dx);
    this.x[i] = xin - cos(angle) * this.segLength;
    this.y[i] = yin - sin(angle) * this.segLength;
    this.segment(this.x[i], this.y[i], angle);
  }

  segment(x, y, a) {
    push();
    translate(x, y);
    rotate(a);
    stroke(166, 220, 222, 100)
    strokeWeight(10*this.size)
    line(0, 0, this.segLength, 0);
    pop();
  }
}

class LumenAlgae extends Flock {
  constructor(pos, vel, size) {
    super(pos, vel, 0.85, 8, repulseDist);
    this.size = size
  }

  update() {
    this.updateCoords()
  }

  display() {
    let opacity = map(sq(this.vel.mag()), 0, this.maxVelSq, 0, 255, true)
    noStroke
    fill(0, 255, 251, opacity)
    circle(this.pos.x, this.pos.y, this.size)
  }
}

class MouseMan {
  constructor(scary) {
    this.pos = createVector(mouseX, mouseY)
    this.vel = createVector(0, 0)
    this.size = 40
  }

  display() {
    if (this.pos.x !== mouseX && this.pos.y !== mouseY) {
      this.vel.x = mouseX - this.pos.x
      this.vel.y = mouseY - this.pos.y
    }
    if (simple) {
      push()
      translate(this.pos.x, this.pos.y)
      rotate(HALF_PI + atan2(this.vel.y, this.vel.x))
      fill("#d4507c")
      noStroke()
      rectMode(CENTER)
      rect(0, 10, 8, 20)
      pop()
    } else {
      push()
      translate(this.pos.x, this.pos.y)
      rotate(HALF_PI + atan2(this.vel.y, this.vel.x))
      image(zippyImg, 0, this.size/2, this.size, this.size);
      pop()
    }

    this.pos.x = mouseX
    this.pos.y = mouseY
  }
}

class MouseFriend extends Flock {
  constructor(pos, vel, size) {
    super(pos, vel, 0.8, 7, repulseDist);
    this.size = size
  }

  update() {
    this.updateCoords()
  }

  display() {
    if (simple) {
      push()
      translate(this.pos.x, this.pos.y)
      rotate(HALF_PI + atan2(this.vel.y, this.vel.x))
      fill(212, 80, 124, 150)
      noStroke()
      rectMode(CENTER)
      rect(0, 10, 6, 20)
      pop()
    } else {
      push()
      translate(this.pos.x, this.pos.y)
      rotate(HALF_PI + atan2(this.vel.y, this.vel.x))
      imageMode(CENTER)
      image(zippyImg, 0, 0, this.size, this.size);
      pop()
    }
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.r = 1
    this.opacity = 200
    this.alive = true
  }

  display() {
    fill(0, 191, 255, this.opacity)
    circle(this.x, this.y, this.r)
    this.opacity -= 6
    this.r += 2
    if (this.opacity < 0) {
      this.alive = false
    }
  }
}