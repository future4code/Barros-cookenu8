import express from "express";
import { RecipeController } from "../controller/RecipeController";

export const recipeRouter = express.Router()
const recipeController = new RecipeController()
recipeRouter.post("/recipe", recipeController.createRecipe)
recipeRouter.get("/", recipeController.getAllRecipes)
recipeRouter.get("/recipe/:id", recipeController.getRecipeById)