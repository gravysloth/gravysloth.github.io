//
//
//
//

var fileNames = [
    // "Streaming_History_Audio_2014-2016_0",
    "Streaming_History_Audio_2016-2018_1",
    "Streaming_History_Audio_2018-2021_2",
    "Streaming_History_Audio_2021-2022_3",
    "Streaming_History_Audio_2022-2024_4",
    "Streaming_History_Audio_2024_5"
]

function getFileName(index) {
    return "data/" + fileNames[index] + ".json"
}

function doTheThing() {
    document.getElementById('sketch').style.display = "block"
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
        // consoleLogFromCalculations()
        outputFromCalculations()
    }
}

function outputFromCalculations() {
    document.getElementById('instructions').style.display = "none"
    document.getElementById('outputSummary').style.display = "block"
    document.getElementById('numUniqueSongs').innerText = numberWithCommas(uriToTrackStringMap.size)
    document.getElementById('numTimeListened').innerText = msToString(totalDuration)
    document.getElementById('mostSkippedSong').innerText = uriToTrackStringMap.get(mostSkippedSong[0])
    document.getElementById('numSkips').innerText = numberWithCommas(mostSkippedSong[1])
    document.getElementById('firstDateTime').innerText = dateTimeToString(firstSongDateTime)
    let freqSongsView = document.getElementById('mostFreqSongs')
    freqSongsView.innerHTML = ""
    let durationSongsView = document.getElementById('mostDurationSongs')
    durationSongsView.innerHTML = ""
    for (let i = 0; i < topLength; i++) {
        let freqSongItem = ""
        freqSongItem += '<div class="flex-container listItem"><div class="flex-item-left leftAlign number">'
        freqSongItem += i + 1
        freqSongItem += '</div><div class="flex-item-left leftAlign songNameArtist">'
        freqSongItem += uriToTrackStringMap.get(sortedSongsFreq[i][0])
        freqSongItem += '</div><div class="spacer"></div><div class="flex-item-right rightAlign numTimes bold">'
        freqSongItem += sortedSongsFreq[i][1]
        freqSongItem += '</div></div>'

        freqSongsView.innerHTML += freqSongItem

        let durationSongItem = ""
        durationSongItem += '<div class="flex-container listItem"><div class="flex-item-left leftAlign number">'
        durationSongItem += i + 1
        durationSongItem += '</div><div class="flex-item-left leftAlign songNameArtist">'
        durationSongItem += uriToTrackStringMap.get(sortedSongDuration[i][0])
        durationSongItem += '</div><div class="spacer"></div><div class="flex-item-right rightAlign numTimes bold">'
        durationSongItem += msToString(sortedSongDuration[i][1])
        durationSongItem += '</div></div>'

        durationSongsView.innerHTML += durationSongItem
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
var songDataByDayOfWeek = {}

var firstSongDateTime = null

function handleJsonData(data) {
    // loop through the json data
    for (let i = 0; i < data.length; i++) {
        // --------- pruning --------- //
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

        // --------- get the variables --------- //
        let ts = data[i]["ts"]
        let date = new Date(ts)
        let msPlayed = data[i]["ms_played"]
        let skipped = data[i]["skipped"]
        let yearMonth = date.getUTCFullYear() + "-" + date.getUTCMonth()
        let dayOfWeek = date.getUTCDay()

        // --------- add to the uri to track string map for lookup --------- //
        if (!uriToTrackStringMap.has(uri)) {
            uriToTrackStringMap.set(uri, makeTrackString(data[i]))
        }

        // --------- first time a song was played ever --------- //
        if (firstSongDateTime == null || date < firstSongDateTime) {
            firstSongDateTime = date
        }

        // --------- song data for each month --------- //
        if (!(yearMonth in songDataByMonth)) {
            songDataByMonth[yearMonth] = {
                "duration": 0,
                "numberSongs": 0,
                "songs": {}
            }
        }
        if (!(uri in songDataByMonth[yearMonth]["songs"])) {
            songDataByMonth[yearMonth]["songs"][uri] = {
                "freq": 0,
                "duration": 0
            }
        }
        songDataByMonth[yearMonth]["duration"] += msPlayed
        songDataByMonth[yearMonth]["numberSongs"] += 1

        songDataByMonth[yearMonth]["songs"][uri]["freq"] += 1
        songDataByMonth[yearMonth]["songs"][uri]["duration"] += msPlayed

        // --------- song data for day of the week --------- //
        if (!(dayOfWeek in songDataByDayOfWeek)) {
            songDataByDayOfWeek[dayOfWeek] = {
                "duration": 0,
                "numberSongs": 0
            }
        }
        songDataByDayOfWeek[dayOfWeek]["duration"] += msPlayed
        songDataByDayOfWeek[dayOfWeek]["numberSongs"] += 1

        // --------- add to total duration --------- //
        totalDuration += msPlayed

        // --------- add to song duration map --------- //
        if (songDurationMap.has(uri)) {
            songDurationMap.set(uri, songDurationMap.get(uri) + msPlayed)
        } else {
            songDurationMap.set(uri, msPlayed)
        }

        // --------- add to song frequency map --------- //
        if (songFreqMap.has(uri)) {
            songFreqMap.set(uri, songFreqMap.get(uri) + 1)
        } else {
            songFreqMap.set(uri, 1)
        }

        // --------- add to song skipped map if skipped and less than 10 seconds played --------- //
        if (skipped = true && msPlayed < 10000) {
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

var topLength = 100;

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

function dateTimeToString(dateTime) {
    let dateTimeSplit = dateTime.toUTCString().split(' ')
    let date = dateTimeSplit[0] + " " + dateTimeSplit[2] + " " + dateTimeSplit[1] + " " + dateTimeSplit[3]
    let time = dateTimeSplit[4]
    return date + " @ " + time + " UTC"
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