import { CustomError } from "../error/CustomError";
import { EditRecipeInput, InsertRecipeDTO, Recipe} from "../model/recipeDTO";
import { BaseDatabase } from "./BaseDatebase";
import { UserDatabase } from "./UserDatabase";

export class RecipeDatabase extends BaseDatabase {

    createRecipe = async (recipe: InsertRecipeDTO): Promise<void> => {
        try {

            await RecipeDatabase.connection("Recipes_Cookenu")
            .insert({
                id: recipe.id,
                title: recipe.title,
                description: recipe.description,
                author_id: recipe.authorId
            })

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getAllRecipes = async(): Promise<Recipe[]> => {
        try {
            const result = await RecipeDatabase.connection("Recipes_Cookenu").select()
            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)  
        }
    };

    getRecipeById = async(id: string): Promise<Recipe> => {

        try {

            const result = await RecipeDatabase.connection("Recipes_Cookenu")
            .select()
            .where({id})
    
            return result[0]
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getRecipesByAuthorId = async(id: string) => {
        try {
            
            const result = await RecipeDatabase.connection("Recipes_Cookenu")
            .select("Recipes_Cookenu.id", "Recipes_Cookenu.title", "Recipes_Cookenu.description", "Recipes_Cookenu.created_at as createdAt", "Users_Cookenu.id as userId", "Users_Cookenu.name as userName")
            .where({author_id: id})
            .join("Users_Cookenu", "author_id", "=", "Users_Cookenu.id")

            return result
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    editRecipe = async(recipe: EditRecipeInput): Promise<void> => {
        try {
            
            await RecipeDatabase.connection("Recipes_Cookenu")
            .update({title: recipe.title, description: recipe.description})
            .where({id: recipe.id})

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    deleteRecipe = async(id: string): Promise<void> => {
        try {
            await RecipeDatabase.connection("Recipes_Cookenu")
            .delete()
            .where({id})

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };
}