//
//
//
//
//

let canvasSize = 600

/**
 * Enum for color teams.
* @readonly
* @enum {{name: string, hex: string}}
*/
const Colors = Object.freeze({
  0: { num: 0, enemy: 1, name: "red", hex: "#f54242" },
  1: { num: 1, enemy: 2, name: "blue", hex: "#4287f5" },
  2: { num: 2, enemy: 3, name: "green", hex: "#69ab65" },
  3: { num: 3, enemy: 0, name: "yellow", hex: "#fff196" }
});

function preload() {
}

let bricksManager, ballsManager;

function setup() {
  var canvas = createCanvas(canvasSize, canvasSize)
  canvas.parent("sketch")
  frameRate(60)
  noStroke()

  bricksManager = new BricksManager(20)
  bricksManager.setup()

  ballsManager = new BallsManager()
  ballsManager.setup()
}

function draw() {
  background(0)

  bricksManager.draw()
  ballsManager.manage()
}

class BricksManager {
  constructor(numPerSide) {
    this.numPerSide = numPerSide
    this.grid = []
    this.size = canvasSize / numPerSide
  }

  setup() {
    for (let y = 0; y < this.numPerSide; y++) {
      let row = []
      for (let x = 0; x < this.numPerSide; x++) {
        let team = Colors[0]
        if (x >= this.numPerSide / 2) {
          team = Colors[1]
          if (y <= this.numPerSide / 4) {
            team = Colors[3]
          }
        } else if (y >= this.numPerSide / 4 * 3) {
          team = Colors[2]
        }
        let pos = createVector(this.size * x, this.size * y)
        row.push(new Brick(pos, this.size, team))
      }
      this.grid.push(row)
    }
  }

  draw() {
    for (let y = 0; y < this.numPerSide; y++) {
      for (let x = 0; x < this.numPerSide; x++) {
        this.grid[y][x].draw()
      }
    }
  }
}

class Brick {
  constructor(pos, size, team) {
    this.pos = pos
    this.size = size
    this.team = team
  }

  draw() {
    push()
    strokeWeight(0)
    stroke(51)
    fill(this.team.hex)
    rect(this.pos.x, this.pos.y, this.size, this.size)
    pop()
  }
}

class BallsManager {
  constructor() {
    this.balls = []
    this.ballSize
  }

  setup() {
    this.ballSize = canvasSize / bricksManager.numPerSide / 2
    // red ball
    this.balls.push(
      new Ball(createVector(550, 440),
        createVector(6, 3),
        this.ballSize,
        Colors[0]))
    // blue ball
    this.balls.push(
      new Ball(createVector(30, 40),
        createVector(-4, 4),
        this.ballSize,
        Colors[1]))
    // green ball
    this.balls.push(
      new Ball(createVector(260, 40),
        createVector(-4, 4),
        this.ballSize,
        Colors[2]))
    // yellow ball
    this.balls.push(
      new Ball(createVector(350, 380),
        createVector(-4, 3),
        this.ballSize,
        Colors[3]))
  }

  manage() {
    for (let i = 0; i < this.balls.length; i++) {
      this.eval(this.balls[i])
      this.wallBounce(this.balls[i])
      this.balls[i].move()
      this.contain(this.balls[i])
      this.balls[i].draw()
    }
  }

  eval(ball) {
    // Check multiple points around the ball's circumference
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
      let checkX = ball.pos.x + Math.cos(angle) * (ball.r);
      let checkY = ball.pos.y + Math.sin(angle) * (ball.r);

      let i = Math.floor(checkX / bricksManager.size);
      let j = Math.floor(checkY / bricksManager.size);
      if (i >= 0 && i < bricksManager.numPerSide && j >= 0 && j < bricksManager.numPerSide) {
        if (ball.team.num == bricksManager.grid[j][i].team.num) {
          bricksManager.grid[j][i].team = Colors[ball.team.enemy]
          // Determine bounce direction based on the angle
          if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
            ball.vel.x = -ball.vel.x;
          } else {
            ball.vel.y = -ball.vel.y;
          }

          ball.vel.add(createVector(random(-0.1, 0.1), random(-0.1, 0.1)))
        }
      }
    }
  }

  wallBounce(ball) {
    if (ball.pos.x <= ball.r || ball.pos.x >= canvasSize - ball.r) {
      ball.vel.x = -ball.vel.x
    }
    if (ball.pos.y <= ball.r || ball.pos.y >= canvasSize - ball.r) {
      ball.vel.y = - ball.vel.y
    }
  }

  contain(ball) {
    if (ball.pos.x < ball.r) {
      ball.pos.x = ball.r
    }
    if (ball.pos.x > canvasSize - ball.r) {
      ball.pos.x = canvasSize - ball.r
    }
    if (ball.pos.y < ball.r) {
      ball.pos.y = ball.r
    }
    if (ball.pos.y > canvasSize - ball.r) {
      ball.pos.y = canvasSize - ball.r
    }
  }
}

class Ball {
  constructor(pos, vel, r, team) {
    this.pos = pos
    this.vel = vel
    this.r = r
    this.team = team
  }

  draw() {
    push()
    ellipseMode(CENTER)
    fill(this.team.hex)
    circle(this.pos.x, this.pos.y, this.r * 2)
    pop()
  }

  move() {
    this.vel.setMag(8)
    this.pos.add(this.vel)
  }
}