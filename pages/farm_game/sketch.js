var ThingList = []
var ms = 1000

function Log(log) {
    console.log(log)
}

function setup() {
    Canvas = createCanvas(1024, 1024 * 3 / 4)
    GameWidth = width
    GameHeight = height - 132
    loadSounds()

    lastMousePressed = false

    CreateThing(new Jojo(400, 400))
    // CreateThing(new Jojo(400, 400))
    CreateThing(new Bush(200, 200))
}

function CreateThing(thing) {
    ThingList.push(thing)
    return thing
}

function update() {
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

    isDragging = false
    for (let d = ThingList.length - 1; d >= 0; d--) {
        let thing = ThingList[d]
        if (thing.draggable && !isDragging && mouseIsPressed && !lastMousePressed
            && dist(mouseX, mouseY, thing.x, thing.y) <= thing.radius
            && thing.visible) {
            Log(thing.name)
            isDragging = true
            thing.isDragging = true
        }
    }

    lastMousePressed = mouseIsPressed
}

function draw() {
    update()
    background(255, 254, 238)
    textSize(24)

    // rect(0, 0, GameWidth, GameHeight);

    for (let i = 0; i < ThingList.length; i++) {
        if (ThingList[i].mainDraw) {
            ThingList[i].draw()
        }
    }
    // noLoop()
}


function GetAngle(x1, y1, x2, y2) {
    return atan2(y2 - y1, x2 - x1)
}