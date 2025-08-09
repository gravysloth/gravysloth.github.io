let pop1, crunch1, wah1, wah2

function loadSounds() {
    soundFormats('mp3', 'm4a')
    pop1 = loadSound('sounds/pop1')
    pop1.setVolume(0.2)

    crunch1 = loadSound('sounds/crunch1')
    crunch1.setVolume(0.8)

    wah1 = loadSound('sounds/wah1')
    wah1.setVolume(3)

    wah2 = loadSound('sounds/wah2')
    wah2.setVolume(3)
}