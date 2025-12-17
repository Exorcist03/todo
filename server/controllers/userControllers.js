const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function signup(req, res) { 
    // what it requires is needs info of the user and then stores it in the database and returns him a token
    const username = req.body.username, email = req.body.email, password = req.body.password;
    if(!username || !email || !password) {
        return res.status(400).json({
            success: false,
            msg: "Needed more info!!"
        })
    }
    try {
        const gotUser = await User.findOne({email});
        if(gotUser) {
            return res.status(400).json({
                success: false,
                msg: "Email already exists!!"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({
            username, email, password: hashedPassword
        })
        const token = jwt.sign(email, process.env.JWT_SECRET)
        return res.status(200).json({
            success: true,
            msg: "User created successfully!!",
            token
        })
    }
    catch(err) {
        console.log("error while signup, ", err);
    }
}

async function login(req, res) {
    const email = req.body.email, password = req.body.password;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "more info required to login!!"
        })
    }
    try {
        const gotUser = await User.findOne({email});
        if(!gotUser) {
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exist"
            })
        }
        const correct = bcrypt.compare(password, gotUser.password);
        if(!correct) {
            return res.status(400).json({
                success: false,
                msg: "Incorrect password!!"
            })
        }
        const token = jwt.sign(email, process.env.JWT_SECRET);
        return res.json({
            success: true,
            msg: "logged in succesfully",
            token
        })
    } catch (error) {
        console.log("Error while loging in, ", error);
    }
}

module.exports = {
    signup, login
}