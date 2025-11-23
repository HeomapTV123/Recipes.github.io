const express = require("express");
const user = require("../model/User");
const bcrypt = require("bcrypt");

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
        const userExists = await user.findByEmail(email);
        if(userExists) {
            return res.status(500).json({message: "User already existed."});
        }
        
        const userID = await user.create({
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

module.exports = router;
