var ThingList = []
var menu
const secondsToMs = 1000

ySortUpdateTime = 1

function Log(log) {
    console.log(log)
}

function preload() {
    loadSounds()
}

function setup() {
    Canvas = createCanvas(1024, 1024 * 3 / 4)
    frameRate(20)
    GameWidth = width
    GameHeight = height - 132
    textSize(24)
    lastMousePressed = false

    menu = new Menu()
    CreateThing(new Bush(200, 200))
    CreateThing(new Jojo(400, 400))
    // CreateThing(new Jojo(400, 400))
    cursor("imgs/cursor_hand.png")
}

function CreateThing(thing) {
    ThingList.push(thing)
    return thing
}

function update() {
    updateAnims()

    isDragging = false
    if (mouseIsPressed && !lastMousePressed) {
        for (let d = ThingList.length - 1; d >= 0; d--) {
            let thing = ThingList[d]
            if (thing.draggable && !isDragging && dist(mouseX, mouseY, thing.x, thing.y) <= thing.radius && thing.visible) {
                Log(thing.name)
                isDragging = true
                thing.isDragging = true
                ThingList.push(ThingList.splice(d, 1)[0])
                cursor("imgs/cursor_grab.png", 12, 12)
            }
        }
    }

    if (!mouseIsPressed) {
        cursor("imgs/cursor_hand.png", 12, 12)
    }

    let i = 0
    while (i < ThingList.length) {
        if (ThingList[i].update() && !ThingList[i].dead) {
            if (ThingList[i].name == "thing") {
                console.log("Is this supposed to be drawn?")
            }
            i++
        } else {
            ThingList.splice(i, 1)
        }
    }

    ThingList.forEach((thing) => {
        thing.finishUpdate()
    })

    lastMousePressed = mouseIsPressed
}

function draw() {
    update()
    background(255, 254, 238)
    if (frameCount % (ySortUpdateTime * getTargetFrameRate()) == 0) {
        yPosSort()
    }

    push()
    noFill()
    rect(0, 0, GameWidth, GameHeight)
    pop()

    menu.draw()

    ThingList.forEach((thing) => {
        if (thing.mainDraw) {
            thing.draw()
        }
    })

    drawAnims()
    // noLoop()
}

function yPosSort() {
    ThingList.sort(yCompare)
}

function yCompare(a, b) {
    if (a.y < b.y && !a.isDragging) {
        return -1;
    }
    if (a.y > b.y && !b.isDragging) {
        return 1;
    }
    return 0;
}


function GetAngle(x1, y1, x2, y2) {
    return atan2(y2 - y1, x2 - x1)
}