const db = require("../config/db");

// Get all recipes
exports.getAll = () => {
    return db.promise().query("SELECT * FROM Recipe");
};

// Get recipe by ID
exports.getById = (id) => {
    return db.promise().query("SELECT * FROM Recipe WHERE recipe_id = ?", [id]);
};

// Get steps
exports.getSteps = (id) => {
    return db.promise().query(`
        SELECT * FROM Step 
        WHERE recipe_id = ?
        ORDER BY step_number ASC
    `, [id]);
};

// Get ingredients
exports.getIngredients = (id) => {
    return db.promise().query(`
        SELECT ri.quantity, ri.unit, ri.preparation, i.name
        FROM RecipeIngredient ri
        JOIN Ingredient i ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?
        ORDER BY ri.position ASC
    `, [id]);
};

// Get recipes by category
exports.getByCategory = (name) => {
    return db.promise().query(`
        SELECT r.*
        FROM Recipe r
        JOIN RecipeCategory rc ON r.recipe_id = rc.recipe_id
        JOIN Category c ON rc.category_id = c.category_id
        WHERE LOWER(c.name) = LOWER(?)
    `, [name]);
};

// Get all categories
exports.getAllCategories = () => {
    return db.promise().query("SELECT * FROM Category");
};
//Create new Recipe
exports.createRecipe = async ({ userId, title, description, prep_time, cook_time, image_url }) => {
    const [result] = await db.promise().query(
        `INSERT INTO Recipe (user_id, title, description, prep_time, cook_time, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, title, description, prep_time, cook_time, image_url]
    );
    return result.insertId;
};

exports.attachCategories = async (recipeId, categories = []) => {
    for (const categoryName of categories) {
        const [[cat]] = await db.promise().query(
            "SELECT category_id FROM Category WHERE name = ?",
            [categoryName]
        );
        if (cat) {
            await db.promise().query(
                "INSERT INTO RecipeCategory (recipe_id, category_id) VALUES (?, ?)",
                [recipeId, cat.category_id]
            );
        }
    }
};

exports.attachTags = async (recipeId, tags = []) => {
    for (const tagName of tags) {
        const [[existing]] = await db.promise().query(
            "SELECT tag_id FROM Tag WHERE name = ?",
            [tagName]
        );

        let tagId = existing?.tag_id;
        if (!tagId) {
            const [res] = await db.promise().query(
                "INSERT INTO Tag (name) VALUES (?)",
                [tagName]
            );
            tagId = res.insertId;
        }

        await db.promise().query(
            "INSERT INTO RecipeTag (recipe_id, tag_id) VALUES (?, ?)",
            [recipeId, tagId]
        );
    }
};

exports.attachIngredients = async (recipeId, ingredients = []) => {
    for (let i = 0; i < ingredients.length; i++) {
        const { name, quantity, unit } = ingredients[i];

        const [[existing]] = await db.promise().query(
            "SELECT ingredient_id FROM Ingredient WHERE name = ?",
            [name]
        );

        let ingredientId = existing?.ingredient_id;
        if (!ingredientId) {
            const [res] = await db.promise().query(
                "INSERT INTO Ingredient (name) VALUES (?)",
                [name]
            );
            ingredientId = res.insertId;
        }

        await db.promise().query(
            `INSERT INTO RecipeIngredient
             (recipe_id, ingredient_id, quantity, unit, position)
             VALUES (?, ?, ?, ?, ?)`,
            [recipeId, ingredientId, quantity, unit, i + 1]
        );
    }
};

exports.attachSteps = async (recipeId, steps = []) => {
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await db.promise().query(
            `INSERT INTO Step (recipe_id, step_number, instruction, duration_minutes, tip)
             VALUES (?, ?, ?, ?, ?)`,
            [recipeId, i + 1, step.instruction, step.duration, step.tip]
        );
    }
};


