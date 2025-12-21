const Recipe = require("../model/recipeModel");

exports.getAllRecipes = async (req, res) => {
    const [rows] = await Recipe.getAll();
    res.json(rows);
};

exports.getRecipeById = async (req, res) => {
    const [rows] = await Recipe.getById(req.params.id);
    res.json(rows[0] || {});
};

exports.getRecipeSteps = async (req, res) => {
    const [rows] = await Recipe.getSteps(req.params.id);
    res.json(rows);
};

exports.getRecipeIngredients = async (req, res) => {
    const [rows] = await Recipe.getIngredients(req.params.id);
    res.json(rows);
};

exports.getRecipesByCategory = async (req, res) => {
    const [rows] = await Recipe.getByCategory(req.params.name);
    res.json(rows);
};

exports.getAllCategories = async (req, res) => {
    const [rows] = await Recipe.getAllCategories();
    res.json(rows);
};

exports.getTagsByRecipe = async (req, res) => {
    const [rows] = await Recipe.getTagsByRecipe(req.params.id);
    res.json(rows);
}

exports.createRecipe = async (req, res) => {
    try {
        // 1. Must be logged in
        if (!req.session.user) {
            return res.status(401).json({ message: "Login required" });
        }

        const userId = req.session.user.id;

        const {
            title,
            description,
            prep_time,
            cook_time,
            categories,
            tags,
            ingredients,
            steps,
            image_url
        } = req.body;

        if (!title || !ingredients || !steps) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const recipeId = await Recipe.createRecipe({
            userId,
            title,
            description,
            prep_time,
            cook_time,
            image_url
        });

        await Recipe.attachCategories(recipeId, categories);
        await Recipe.attachTags(recipeId, tags);
        await Recipe.attachIngredients(recipeId, ingredients);
        await Recipe.attachSteps(recipeId, steps);

        res.status(201).json({
            message: "Recipe created successfully",
            recipeId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
