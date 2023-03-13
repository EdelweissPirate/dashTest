const express = require("express")
const app = express()
const path = require("path");
const fs = require('fs');

const protect = require('./middleware/authMiddleware')

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/ARP-L_LESSON_2_IMPLEMENTATION_PART_1")));

const getVideo = (req, res) => {
    let params = (new URL(req.headers.referer + req.url)).searchParams;

    const urlParams = new URLSearchParams(params);
    const videoName = urlParams.get('videoName')

    const filename = __dirname + `/public/${videoName}/output.mpd`;

    const readStream = fs.createReadStream(filename);

    readStream.on('open', function () {
        // This just pipes the read stream to the response object (which goes to the client)
        readStream.pipe(res); // <====== here
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
        res.end(err);
    });

    // res.sendFile(__dirname + `/public/${videoName}/output.mpd`);
}

app.get("/getVideo", protect, getVideo);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(3000)