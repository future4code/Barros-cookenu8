import { CustomError } from "../error/CustomError";
import { InsertRecipeDTO } from "../model/recipeDTO";
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
    }
}