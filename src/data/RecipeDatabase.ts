import { CustomError } from "../error/CustomError";
import { InsertRecipeDTO, Recipe} from "../model/recipeDTO";
import { BaseDatabase } from "./BaseDatebase";

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
    }

    getRecipeById = async(id: string): Promise<Recipe> => {

        try {

            const result = await RecipeDatabase.connection("Recipes_Cookenu")
            .select()
            .where({id})
    
            return result[0]
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}