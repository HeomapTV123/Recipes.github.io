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
