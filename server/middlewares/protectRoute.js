const jwt = require('jsonwebtoken');
require('dotenv').config();

async function protectRoute(req, res, next) {
    let token;
    // console.log(req.headers)
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // console.log(token);
    if(!token) {
        return res.status(401).json({
            success: false,
            msg: "You are not logged in please log in!!"
        })
    }
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    req.headers.email = decoded;
    next();
}

module.exports = {protectRoute};