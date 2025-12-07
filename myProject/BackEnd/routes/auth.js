const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
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

        // Compare password to the hashed password
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);
        if(!isMatch) {
            return res.status(400).json({ message: "Username or Password is incorrect"});
        }

        // CREATE SESSION
        // This automatically creates a cookie with a session ID and sends it to the browser
        // The data below is stored on the SERVER, not in the cookie
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        // Save the session to ensure it's written before responding
        res.session.save(err => {
            if(err) return res.status(500).json({error: "Session error"});
            res.status(200).json({message: "Login successful"});
        })

    }
    catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// Logout
router.post("/logout", (req, res) => {
    // Destroy the session on the server
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).send("Log out unsuccessful.");
        }

        // Clear the cookie on the client
        res.clearCookie("connect.sid"); // default name
        res.json({message: "Logout successfully"});
    });
});




module.exports = router;