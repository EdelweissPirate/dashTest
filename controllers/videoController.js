const fs = require('fs');

const getVideo = (req, res) => {
    let range = req.headers.range;

    if(!range || range === undefined) {
        range = 'bytes=0-';
    }

    let params = (new URL(req.headers.referer + req.url)).searchParams;

    const urlParams = new URLSearchParams(params);
    const videoName = urlParams.get('videoName')

    const filename = __dirname + `/../public/${videoName}/output.mpd`;
    
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
}

module.exports = getVideo