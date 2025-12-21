const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Categories
router.get("/category/:name", recipeController.getRecipesByCategory);
router.get("/categories", recipeController.getAllCategories);

// Recipes
router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipeById);

// Steps + Ingredients
router.get("/:id/steps", recipeController.getRecipeSteps);
router.get("/:id/ingredients", recipeController.getRecipeIngredients);

// Tags
router.get("/:id/tag", recipeController.getTagsByRecipe);

// ADD RECIPE (protected)
router.post("/", recipeController.createRecipe);




module.exports = router;
