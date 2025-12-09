const express = require('express');

const cors = require('cors');
const router = require("./routes/auth");
const session = require("express-session");
const path = require("path");
const recipeRoutes = require("./routes/recipeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "FrontEnd" , "html" ,"main.html"));
});

app.use(express.static(path.join(__dirname, "..", "FrontEnd")));
app.use(session({
        secret: process.env.SESSION_SECRET, // used to sign the session ID cookie
        resave: false,
        saveUninitialized: false, // Don't create a session until something is stored
        cookie: {
            secure: false, // set to true if using HTTPS
            httpOnly: true, // Prevent JavaScript(XSS) from reading the cookie
            maxAge: 1000 * 60 * 60 // 1 hour
        }
    }));

// All the functions in auth.js 
app.use("/", router);
app.use("/recipes", recipeRoutes);
// ================================
// START SERVER
// ================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

