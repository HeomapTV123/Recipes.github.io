const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// sign up
router.post("/signup", async(req, res) => {
    const {
        name,
        email,
        password_hash
    } = req.body;

    const hash_password = await bcrypt.hash(password_hash, 10);

    try {
        const userExists = await User.findByEmail(email);
        if(userExists) {
            return res.status(500).json({message: "User already existed."});
        }
        
        const userID = await User.create({
            name,
            email,
            password_hash: hash_password
        });

        if(userID) {
            res.status(200).json({
                message: "User created successfully", userID
            });
        }
    }
    catch (err){
        if(err) res.status(500).json({
            error: err.message
        });
    }
});

// Log in
router.post("/login", async(req, res) => {
    const {
        name,
        password_hash
    } = req.body;


    try {
        const user = await User.findByName(name);
        if(!user) {
            return res.status(400).json({ message: "Username or Password is incorrect"});
        }

        const isMatch = await bcrypt.compare(password_hash, user.password_hash);
        if(!isMatch) {
            return res.status(400).json({ message: "Username or Password is incorrect"});
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.json({message: "Login successful", token});
    }
    catch (err) {
        res.status(500).json({ error: err.message});
    }
});


module.exports = router;