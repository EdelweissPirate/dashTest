const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    const referer = req.headers.referer;
        
    if(!referer || !referer.includes("dash")){//dash
        res.sendStatus(403);
        throw new Error('Not authorised.')
    } else {
        next();
    }
})

module.exports = protect