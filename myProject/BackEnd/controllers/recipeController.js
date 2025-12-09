const Recipe = require("../models/recipeModel");

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
