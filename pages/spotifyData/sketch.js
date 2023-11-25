
let marqueeData = {}
let streamingData = {}

function preload() {
  marqueeData = loadJSON("data/Marquee.json")
  streamingData = loadJSON("data/StreamingHistory0.json")
  console.log("json loaded")
}

function setup() {
  var canvas = createCanvas(600, 600)
  canvas.parent("sketch")
  frameRate(30)
  noStroke()

  parseMarqueeData()
  parseStreamingData()
}

function draw() {
  background(0)
}

let artistMarquees = {
  "Light listeners": [],
  "Moderate listeners": [],
  "Super Listeners": [],
}

function parseMarqueeData() {
  for (let i = 0; i < Object.keys(marqueeData).length; i++) {
    if (marqueeData[i]["segment"] == "Light listeners") {
      artistMarquees["Light listeners"].push(marqueeData[i]["artistName"])
    } else if (marqueeData[i]["segment"] == "Moderate listeners") {
      artistMarquees["Moderate listeners"].push(marqueeData[i]["artistName"])
    } else if (marqueeData[i]["segment"] == "Super Listeners") {
      artistMarquees["Super Listeners"].push(marqueeData[i]["artistName"])
    }
  }
  console.log(artistMarquees)
}

// "artistName - songTitle": times listened
let songPlayedFrequency = {}
let mostPlayedSongsFrequency = []

let songPlayedTime = {}
let mostSongsPlayedTime = []

function parseStreamingData() {
  for (let i = 0; i < Object.keys(streamingData).length; i++) {
    let artistTitle = combineArtistNameSongTitle(streamingData[i]["artistName"], streamingData[i]["trackName"])
    if (Object.keys(songPlayedFrequency).includes(artistTitle)) {
      songPlayedFrequency[artistTitle] += 1
    } else {
      songPlayedFrequency[artistTitle] = 1
    }
  }
  console.log(songPlayedFrequency)

  for (var artistSong in songPlayedFrequency) {
    mostPlayedSongsFrequency.push([songPlayedFrequency[artistSong], artistSong])
  }
  
  mostPlayedSongsFrequency.sort(sortFunction)
  mostPlayedSongsFrequency.length = 100

  console.log(mostPlayedSongsFrequency)

  for (let i = 0; i < Object.keys(streamingData).length; i++) {
    let artistTitle = combineArtistNameSongTitle(streamingData[i]["artistName"], streamingData[i]["trackName"])
    if (Object.keys(songPlayedTime).includes(artistTitle)) {
      songPlayedTime[artistTitle] += streamingData[i]["msPlayed"]
    } else {
      songPlayedTime[artistTitle] = streamingData[i]["msPlayed"]
    }
  }
  console.log(songPlayedTime)

  for (var artistSong in songPlayedTime) {
    mostSongsPlayedTime.push([songPlayedTime[artistSong], artistSong])
  }
  
  mostSongsPlayedTime.sort(sortFunction)
  mostSongsPlayedTime.length = 100

  console.log(mostSongsPlayedTime)
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0
    }
    else {
        return (a[0] > b[0]) ? -1 : 1
    }
}

function combineArtistNameSongTitle(artistName, songTitle) {
  return artistName + " - " + songTitle
}