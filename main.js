const express = require("express")
const app = express()
const path = require("path");
const fs = require('fs');

const protect = require('./middleware/authMiddleware')

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/ARP-L_LESSON_2_IMPLEMENTATION_PART_1")));

const getVideo = (req, res) => {
    let range = req.headers.range;

    if(!range || range === undefined) {
        range = 'bytes=0-'; //res.status(400).send("Requires Range header");
    }

    // config
    let params = (new URL(req.headers.referer + req.url)).searchParams;

    const urlParams = new URLSearchParams(params);
    const videoName = urlParams.get('videoName')

    const filename = __dirname + `/public/${videoName}/output.mpd`;
    // end config

    // 3rd attempt
    const videoSize = fs.statSync(filename).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(filename, { start, end });
    videoStream.pipe(res);
    //

    // 2nd attempt
    // const readStream = fs.createReadStream(filename);

    // readStream.on('open', function () {
    //     // This just pipes the read stream to the response object (which goes to the client)
    //     readStream.pipe(res); // <====== here
    // });

    // // This catches any errors that happen while creating the readable stream (usually invalid names)
    // readStream.on('error', function(err) {
    //     res.end(err);
    // });

    // OG
    // res.sendFile(filename);
}

app.get("/getVideo", protect, getVideo);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(3000)