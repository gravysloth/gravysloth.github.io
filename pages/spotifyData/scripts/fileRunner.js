//
//
//
//

var fileNames = [
    // "Streaming_History_Audio_2014-2016_0",
    // "Streaming_History_Audio_2016-2018_1",
    "Streaming_History_Audio_2018-2021_2",
    "Streaming_History_Audio_2021-2022_3",
    "Streaming_History_Audio_2022-2024_4",
    "Streaming_History_Audio_2024_5"
]

function getFileName(index) {
    return "data/" + fileNames[index] + ".json"
}

function doTheThing() {
    numberDoneProcessed = 0
    for (let i = 0; i < fileNames.length; i++) {
        runFile(i)
    }
}

var numberDoneProcessed = 0
var isDataDone = false

function checkIfDataIsDone() {
    if (numberDoneProcessed == fileNames.length) {
        isDataDone = true
        console.log("ahhhh yay")
        calculateFromMaps()
        consoleLogFromCalculations()
    }
}

function runFile(fileIndex) {
    fetch(getFileName(fileIndex))
        .then((response) => response.json())
        .then((data) => handleJsonData(data))
}

var totalDuration = 0

var uriToTrackStringMap = new Map()

var songFreqMap = new Map()
var sortedSongsFreq = []

var songDurationMap = new Map()
var sortedSongDuration = []

var songSkippedFreq = new Map()
var mostSkippedSong = null

var songDataByMonth = {}

function handleJsonData(data) {
    // loop through the json data
    for (let i = 0; i < data.length; i++) {
        let uri = data[i]["spotify_track_uri"]
        if (uri == null) {
            continue
        }
        let episodeUri = data[i]["spotify_episode_uri"]
        if (episodeUri != null) {
            continue
        }
        let platform = data[i]["platform"]
        if (platform == "iOS 9.1 (iPhone5,2)") {
            continue
        }
        // --------- end of pruning --------- //
        let ts = data[i]["ts"]
        let date = new Date(ts)

        let msPlayed = data[i]["ms_played"]
        let skipped = data[i]["skipped"]

        // --------- start of testing zone --------- //
        let yearMonth = date.getUTCFullYear() + "-" + date.getUTCMonth()
        if (!(yearMonth in songDataByMonth)) {
            songDataByMonth[yearMonth] = {}
        }
        if (!(uri in songDataByMonth[yearMonth])) {
            songDataByMonth[yearMonth][uri] = {
                "freq": 0,
                "duration": 0
            }
        }

        songDataByMonth[yearMonth][uri]["freq"] += 1
        songDataByMonth[yearMonth][uri]["duration"] += msPlayed

        // --------- end of testing zone --------- //

        totalDuration += msPlayed

        if (!uriToTrackStringMap.has(uri)) {
            uriToTrackStringMap.set(uri, makeTrackString(data[i]))
        }

        if (songFreqMap.has(uri)) {
            songFreqMap.set(uri, songFreqMap.get(uri) + 1)
        } else {
            songFreqMap.set(uri, 1)
        }

        if (songDurationMap.has(uri)) {
            songDurationMap.set(uri, songDurationMap.get(uri) + msPlayed)
        } else {
            songDurationMap.set(uri, msPlayed)
        }

        if (skipped == true && msPlayed < 2000) {
            if (songSkippedFreq.has(uri)) {
                songSkippedFreq.set(uri, songSkippedFreq.get(uri) + 1)
            } else {
                songSkippedFreq.set(uri, 1)
            }
        }
    }
    numberDoneProcessed += 1
    console.log("done with " + numberDoneProcessed + " file(s)")
    checkIfDataIsDone()
}

function calculateFromMaps() {
    mostSkippedSong = [...songSkippedFreq.entries()].reduce((a, e) => e[1] > a[1] ? e : a)

    sortedSongsFreq = Array.from(songFreqMap);
    sortedSongsFreq.sort(sortByValue)

    sortedSongDuration = Array.from(songDurationMap)
    sortedSongDuration.sort(sortByValue)
}

var topLength = 5;

function consoleLogFromCalculations() {
    console.log("You listened to " + numberWithCommas(uriToTrackStringMap.size) + " different songs\nFor a total of " + msToString(totalDuration))
    console.log("skipped " + uriToTrackStringMap.get(mostSkippedSong[0]) + " " + numberWithCommas(mostSkippedSong[1]) + " times")

    console.log("Your top " + topLength + " songs by frequency are:")
    for (let i = 0; i < topLength; i++) {
        console.log("\t" + (i + 1) + ". " + uriToTrackStringMap.get(sortedSongsFreq[i][0]) + "\n\t\t" + sortedSongsFreq[i][1] + " times")
    }

    console.log("Your top " + topLength + " songs by duration are:")
    for (let i = 0; i < topLength; i++) {
        console.log("\t" + (i + 1) + ". " + uriToTrackStringMap.get(sortedSongDuration[i][0]) + "\n\t\t" + msToString(sortedSongDuration[i][1]))
    }
}

function makeTrackString(trackData) {
    var trackString = ""
    trackString += trackData["master_metadata_track_name"]
    trackString += " - "
    trackString += trackData["master_metadata_album_artist_name"]

    return trackString
}

function msToString(ms) {
    let seconds = ms / 1000
    const weeks = parseInt(seconds / 604_800)
    seconds = seconds % 604_800
    const days = parseInt(seconds / 86_400)
    seconds = seconds % 86_400
    const hours = parseInt(seconds / 3600)
    seconds = seconds % 3600
    const minutes = parseInt(seconds / 60)
    seconds = Math.round(seconds % 60)

    let timeString = ""
    if (weeks > 0) timeString = weeks + "w "
    if (days > 0) timeString += days + "d "
    if (hours > 0) timeString += hours + "h "
    if (minutes > 0) timeString += minutes + "m "
    if (seconds > 0) timeString += seconds + "s"
    if (weeks > 0) timeString += " (~" + numberWithCommas(Math.round(ms / 3_600_600)) + " hours)"
    return timeString
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function sortByValue(a, b) {
    if (a[1] === b[1]) {
        return 0
    }
    else {
        return (a[1] > b[1]) ? -1 : 1
    }
}