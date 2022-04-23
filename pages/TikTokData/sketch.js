
var TikTokData = function(a)
{
    let data = {};

    let VideoList;

    var VideoListDict = {};

    a.preload = function()
    {
        data = a.loadJSON("data/user_data.json");
        console.log("boop")
    }

    a.setup = function()
    {
        var canvas = a.createCanvas(1200, 600);
        canvas.parent("sketch");
        a.frameRate(30);
        
        VideoList = data["Activity"]["Video Browsing History"]["VideoList"]

        for (var i = 0; i < VideoList.length; i++)
        {
            var date = a.split(VideoList[i]["Date"], " ")[0];
            if (date in VideoListDict)
            {
                VideoListDict[date] = VideoListDict[date] + 1;
            }
            else
            {
                VideoListDict[date] = 1;
            }
        }
        console.log(VideoListDict)
    }

    a.draw = function()
    {
        a.background(66, 135, 245);
    }

    a.WatchHistory = function()
    {
        
    }
}

var TikTokDataP5 = new p5(TikTokData, "sketch")

