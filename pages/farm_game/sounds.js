let pop1, crunch1

function loadSounds() {
    soundFormats('mp3', 'm4a')
    pop1 = loadSound('sounds/pop1')
    pop1.setVolume(0.2)

    crunch1 = loadSound('sounds/crunch1')
    crunch1.setVolume(0.8)
}