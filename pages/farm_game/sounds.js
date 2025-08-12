let pop1, crunch1, wah1, wah2, scrape1, coins1
let pops = []

function loadSounds() {
    soundFormats('mp3', 'm4a')
    pop1 = loadSound('sounds/pop1')
    pop1.setVolume(0.2)

    for (let i = 2; i < 8; i++) {
        let pop = loadSound('sounds/pop' + i)
        pops.push(pop)
    }

    crunch1 = loadSound('sounds/crunch1')
    crunch1.setVolume(0.8)

    wah1 = loadSound('sounds/wah1')
    wah1.setVolume(3)

    wah2 = loadSound('sounds/wah2')
    wah2.setVolume(3)

    scrape1 = loadSound('sounds/scrape1')
    scrape1.setVolume(1)

    coins1 = loadSound('sounds/coins1')
}

function eatSound(name) {
    switch (name) {
        case "jojo":
            crunch1.play()
            break
    }
}

function pickupSound() {
    wah1.play()
}

function putdownSound() {
    wah2.play()
}

function fruitPickedSound() {
    pop1.play()

}

function fruitGrownSound() {
    random(pops).play()
}

function poopScoopedSound() {
    scrape1.play()
}

function soldSound() {
    coins1.play()
}