const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const router = require("./routes/auth");
const session = require("express-session");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "FrontEnd", "html", "main.html"));
});

app.use(express.static(path.join(__dirname, "..", "FrontEnd")));

let db; // global DB connection

(async () => { 

    db = await connectDB();
// ================================
// 1️⃣ GET ALL RECIPES
// ================================
app.get('/recipes', (req, res) => {
    db.query('SELECT * FROM Recipe', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ================================
// 2️⃣ GET ONE RECIPE BY ID
// ================================
app.get('/recipes/:id', (req, res) => {
    const recipeId = req.params.id;

    const sql = `
        SELECT * FROM Recipe WHERE recipe_id = ?
    `;

    db.query(sql, [recipeId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0] || {});
    });
});

// ================================
// 3️⃣ GET STEPS FOR A RECIPE
// ================================
app.get('/recipes/:id/steps', (req, res) => {
    const recipeId = req.params.id;

    const sql = `
        SELECT * FROM Step 
        WHERE recipe_id = ?
        ORDER BY step_number ASC
    `;

    db.query(sql, [recipeId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ================================
// 4️⃣ GET INGREDIENTS FOR A RECIPE
// ================================
app.get('/recipes/:id/ingredients', (req, res) => {
    const recipeId = req.params.id;

    const sql = `
        SELECT ri.quantity, ri.unit, ri.preparation, i.name
        FROM RecipeIngredient ri
        JOIN Ingredient i ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?
        ORDER BY ri.position ASC
    `;

    db.query(sql, [recipeId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// =======================================
// 5️⃣ GET STEPS WITH INGREDIENTS PER STEP
// =======================================
app.get('/recipes/:id/steps-with-ingredients', (req, res) => {
    const recipeId = req.params.id;

    const sql = `
        SELECT 
            s.step_id,
            s.step_number,
            s.instruction,
            s.duration_minutes,
            s.image_url,
            s.video_url,
            s.tip,
            si.quantity AS step_qty,
            si.unit AS step_unit,
            si.note AS step_note,
            ing.name AS ingredient_name
        FROM Step s
        LEFT JOIN StepIngredient si ON s.step_id = si.step_id
        LEFT JOIN Ingredient ing ON si.ingredient_id = ing.ingredient_id
        WHERE s.recipe_id = ?
        ORDER BY s.step_number ASC;
    `;

    db.query(sql, [recipeId], (err, results) => {
        if (err) return res.status(500).send(err);

        // Group ingredients inside each step
        const steps = {};
        results.forEach(row => {
            if (!steps[row.step_number]) {
                steps[row.step_number] = {
                    step_id: row.step_id,
                    step_number: row.step_number,
                    instruction: row.instruction,
                    duration_minutes: row.duration_minutes,
                    image_url: row.image_url,
                    video_url: row.video_url,
                    tip: row.tip,
                    ingredients: []
                };
            }
            if (row.ingredient_name) {
                steps[row.step_number].ingredients.push({
                    name: row.ingredient_name,
                    quantity: row.step_qty,
                    unit: row.step_unit,
                    note: row.step_note
                });
            }
        });

        res.json(Object.values(steps));
    });
});

// ================================
// 6️⃣ GET CATEGORIES FOR A RECIPE
// ================================
app.get('/recipes/:id/categories', (req, res) => {
    const recipeId = req.params.id;

    const sql = `
        SELECT c.name 
        FROM RecipeCategory rc
        JOIN Category c ON rc.category_id = c.category_id
        WHERE rc.recipe_id = ?
    `;

    db.query(sql, [recipeId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ================================
// 7️⃣ GET TAGS FOR A RECIPE
// ================================
app.get('/recipes/:id/tags', (req, res) => {
    const recipeId = req.params.id;

    const sql = `
        SELECT t.name 
        FROM RecipeTag rt
        JOIN Tag t ON rt.tag_id = t.tag_id
        WHERE rt.recipe_id = ?
    `;

    db.query(sql, [recipeId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// ================================
// 8️⃣ GET RECIPES BY CATEGORY NAME
// ================================
app.get('/recipes/category/:name', (req, res) => {
    const categoryName = req.params.name;

    const sql = `
        SELECT r.*
        FROM Recipe r
        JOIN RecipeCategory rc ON r.recipe_id = rc.recipe_id
        JOIN Category c ON rc.category_id = c.category_id
        WHERE LOWER(c.name) = LOWER(?)
    `;

    db.query(sql, [categoryName], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

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

})();

// ================================
// START SERVER
// ================================
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

