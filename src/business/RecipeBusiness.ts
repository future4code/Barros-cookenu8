import { RecipeDatabase } from "../data/RecipeDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { MissingData, MissingDescription, MissingTitle, RecipeNotFound } from "../error/RecipeErrors";
import { Unauthorized, UserNotFound } from "../error/UserErrors";
import { InsertRecipeDTO, RecipeInputDTO } from "../model/recipeDTO";
import { IdGenerator } from "../services/idGenerator";

const recipeDatabase = new RecipeDatabase()
const idGenerator = new IdGenerator()
const userDatabase = new UserDatabase()

export class RecipeBusiness {

    createRecipe = async(input: RecipeInputDTO): Promise<void> => {
        try {
            const { title, description, authorId } = input

            if (!title && !description && !authorId) {
                throw new MissingData()
            }

            if (!authorId) {
                throw new Unauthorized()
            }

            const findUser = await userDatabase.getProfile(authorId)
            if (!findUser) {
                throw new UserNotFound()
            }

            if (!title || title.length < 3) {
                throw new MissingTitle()
            }

            if (!description || description.length < 5) {
                throw new MissingDescription()
            }         

            const id = idGenerator.generateId()

            const newRecipe: InsertRecipeDTO = {
                id, title, description, authorId
            }

            await recipeDatabase.createRecipe(newRecipe)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };

    getAllRecipes = async(token: string) => {
        try {
            
            if (!token) {
                throw new Unauthorized()
            }

            const result = recipeDatabase.getAllRecipes()
            return result

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };

    getRecipeById = async(token: string, id: string) => {
        try {
            
            if (!token) {
                throw new Unauthorized()
            }

            if (!id || id === ":id") {
                throw new CustomError(400, "Recipe ID not informed.")
            }

            const result = recipeDatabase.getRecipeById(id)

            if (!result) {
                throw new RecipeNotFound()
            }

            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };
}