const express = require("express");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const router = express.Router();

// MIDDLEWARE: Check Admin Status
const isAdmin = (req, res, next) => {
    // Check if user is logged in AND has role "admin"
    if(req.session.user && req.session.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ message: "Access Denied: Admins only."});
    }
}


// AUTHENTICATION ROUTES

// sign up
router.post("/signup", async (req, res) => {
    const {
        name,
        email,
        password_hash
    } = req.body;

    const hash_password = await bcrypt.hash(password_hash, 10);

    try {
        const userExists = await User.findByEmail(email);
        if (userExists) {
            return res.status(500).json({ message: "User already existed." });
        }

        const userID = await User.create({
            name,
            email,
            password_hash: hash_password
        });

        if (userID) {
            res.status(200).json({
                message: "User created successfully", userID
            });
        }
    }
    catch (err) {
        if (err) res.status(500).json({
            error: err.message
        });
    }
});

// Log in
router.post("/login", async (req, res) => {
    const {
        name,
        password_hash
    } = req.body;


    try {
        const user = await User.findByName(name);
        if (!user) {
            return res.status(400).json({ message: "Username or Password is incorrect" });
        }

        // Compare password to the hashed password
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Username or Password is incorrect" });
        }

        // CREATE SESSION
        // This automatically creates a cookie with a session ID and sends it to the browser
        // The data below is stored on the SERVER, not in the cookie
        req.session.user = {
            id: user.user_id || user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // Save the session to ensure it's written before responding
        req.session.save(err => {
            if (err) return res.status(500).json({ error: "Session error" });
            res.status(200).json({ 
                message: "Login successful", 
                role: user.role
            });
        })

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
router.post("/logout", (req, res) => {
    // Destroy the session on the server
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Log out unsuccessful.");
        }

        // Clear the cookie on the client
        res.clearCookie("connect.sid"); // default name
        res.json({ message: "Logout successfully" });
    });
});

// USER FEATURE ROUTES

// Add to saves (favorites)
router.post('/save', async (req, res) => {
    // 1. Check if the user is actually logged in
    if (!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to save recipes." });
    }

    try {
        // 2. Get User ID from the SESSION (Secure)
        // In your login route, you saved it as 'id': req.session.user = { id: user.id ... }
        // Note: Check your DB column name. If your DB uses 'user_id', ensure your Login route saved it correctly.
        const userId = req.session.user.id;

        // 3. Get Recipe ID from the BODY (Sent by the frontend button)
        const recipeId = req.body.recipeId;

        if (!recipeId) {
            return res.status(400).json({ message: "Recipe ID is required." });
        }

        // 4. Call the function (Use the name you defined in User.js, which was addToFavorites)
        await User.addToSaves(userId, recipeId);

        res.json({ success: true, message: "Added to favorites" });
    } catch (error) {
        console.error(error); // Good to log on server side
        res.status(500).json({ error: error.message });
    }
});

// Delete a favorite
router.delete('/unsave/:id', async (req, res) => {

    if(!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to unfavorite this recipe."});
    }

    try {
        const userId = req.session.user.id;

        const recipeId = req.params.id;

        if (!recipeId) {
            return res.status(400).json({ message: "Recipe ID is required." });
        }

        await User.removeFromSaves(userId , recipeId);

        res.json({ success: true, message: "Deleted from favorites" });
    } catch (error) {
        console.error(error); // Good to log on server side
        res.status(500).json({ error: error.message });        
    }
});

// Get all favorites
router.get('/saves', async (req, res) => {
    if(!req.session.user) {
        return res.status(401).json({ message: "You must be logged in to save recipes." });
    }

    try {
        const userId = req.session.user.id;

        if(!userId) {
            return res.status(404).json({ message: "User ID not found." });
        } 

        const recipes = await User.getAllSaves(userId);

        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/search', async(req, res) => {
    const keyword = req.body.keyword;

    if(!keyword) {
        return res.status(400).json({ message: "Cannot leave the search field empty"});
    }

    try {
        const recipeSearched = await User.searchForRecipe(keyword);
    
        if(recipeSearched.length === 0) {
            return res.status(404).json({
                message: "No recipes found",
                recipes: []
            });
        }

        res.json({
            message: "Search successful",
            count: recipeSearched.length,
            recipes: recipeSearched
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error ", error: err.message});
    }
});
// check if user is logged in
router.get("/check-auth", (req, res) => {
    if(req.session && req.session.user) {
        return res.json({
            isLoggedIn: true,
            role: req.session.user.role
        });
    }
    else {
        return res.json({
            isLoggedIn: false
        })
    }
});

// multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // add folder named "public/uploads" in your project
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage })

// RECIPE ROUTES

// post a recipe
router.post('/add-recipe', upload.single('image'), async (req, res) => {
    try {
        const userId = req.session.user_id; // Assuming you have a logged in user
        const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

        // req.body contains the form fields (title, ingredient[], steps[][instruction], etc)
        const newRecipeId = await User.addRecipe(req.body, userId, imageUrl);

        res.status(200).json({ 
            message: "Recipe created successfully!", 
            recipeId: newRecipeId 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving recipe");
    }
});


// ADMIN ROUTES

// Get all users
router.get('/admin/users', isAdmin, async(req, res) => {
    try {
        const users = await User.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// Delete a user
router.delete('/admin/user/:id', isAdmin, async(req, res) => {
    try {
        await User.deleteUser(req.params.id);
        res.json({ message: "User deleted by Admin successfully."});
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// Delete a recipe
router.delete('/admin/recipe/:id', isAdmin, async (req, res) => {
    try {
        await User.adminDeleteRecipe(req.params.id);
        res.json({ message: "User deleted by Admin" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;