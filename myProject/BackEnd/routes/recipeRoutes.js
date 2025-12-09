const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Recipes
router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);

// Steps + Ingredients
router.get("/:id/steps", recipeController.getRecipeSteps);
router.get("/:id/ingredients", recipeController.getRecipeIngredients);

// Categories
router.get("/category/:name", recipeController.getRecipesByCategory);

module.exports = router;
