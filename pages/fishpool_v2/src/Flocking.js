//
//
// Parent class for flocking types
//
//

class Flocking {
    constructor(pos, vel, friction) {
        this.pos = pos
        this.vel = vel
        this.friction = friction
        this.force = createVector(0, 0)
        this.isClose = false
        this.forceDir = createVector(0, 0)

        this.setup()
    }

    setup() {
        this.maxVel = 5
        this.repulseDist = 30
        this.alignDist = 50
        this.attractDist = 150
        this.huntDist = 250
        this.limitDist = 350

        this.updateMovementStats()
    }

    updateMovementStats() {
        this.repulseDistSq = sq(this.repulseDist)
        this.alignDistSq = sq(this.alignDist)
        this.attractDistSq = sq(this.attractDist)
        this.huntDistSq = sq(this.huntDist)
        this.limitDistSq = sq(this.limitDist)
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
        if (distSq < this.repulseDistSq && distSq !== 0) {
            let dist = sqrt(distSq)
            let forceFactor = -(this.repulseDist / dist - 1) / dist
            this.force.add(forceDir.mult(forceFactor))

            // stroke(0, 255, 0)
            // line(this.pos.x, this.pos.y, this.pos.x + forceDir.x, this.pos.y + forceDir.y)

        }
    }
    // 2
    align(forceDir, distSq) {
        if (distSq > this.repulseDistSq && distSq < this.alignDistSq) {
            let dist = sqrt(distSq);
            let forceFactor = 0.01 * (1 - cos(TWO_PI * (dist - this.repulseDist) / (this.alignDist - this.repulseDist))) / dist
            this.force.add(forceDir.mult(forceFactor))

            stroke(0, 255, 0)
            line(this.pos.x, this.pos.y, this.pos.x + this.forceDir.x, this.pos.y + this.forceDir.y)
        }
    }
    // 3
    attract(fD, distSq) {
        if (distSq > this.alignDistSq && distSq < this.attractDistSq) {
            let dist = sqrt(distSq)
            let forceFactor = 0.01 * (1 - cos(TWO_PI * (dist - this.alignDist) / (this.attractDist - this.alignDist))) / dist
            this.force.add(fD.mult(forceFactor))

            // stroke(0, 255, 0)
            // line(this.pos.x, this.pos.y, this.pos.x + fD.x, this.pos.y + fD.y)
        }
    }

    // move away from something hunting them
    hunted(fD, distSq) {
        if (distSq < this.huntDistSq) {
            let dist = sqrt(distSq)
            let forceFactor = -0.5 * (this.huntDist / dist - 1) / dist
            this.force.add(fD.mult(forceFactor))

            if (dist < 15) {
                this.isClose = true
            }
        }
    }

    hunt(fD, distSq) {
        if (distSq < this.huntDistSq) {
            let dist = sqrt(distSq)
            let forceFactor = 0.2 * (this.huntDist / dist - 1) / dist
            this.force.add(fD.mult(forceFactor))
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

    keepClose() {
        this.forceDir.x = 0.5 * width - this.pos.x;
        this.forceDir.y = 0.5 * height - this.pos.y;
        let distSq = sq(this.forceDir.x) + sq(this.forceDir.y)

        if (distSq > this.limitDistSq) {
            let forceFactor = 1 / this.limitDist
            this.force.add(this.forceDir.mult(forceFactor))
        }
    }
}