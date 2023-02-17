import { RecipeDatabase } from "../data/RecipeDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { MissingData, MissingDataEdit, MissingDescription, MissingTitle, RecipeNotFound } from "../error/RecipeErrors";
import { InvalidEmail, InvalidToken, Unauthorized, UserNotFound } from "../error/UserErrors";
import { EditRecipeInput, GetAllRecipeOutputDTO, InsertRecipeDTO, RecipeInputDTO } from "../model/recipeDTO";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/idGenerator";

const recipeDatabase = new RecipeDatabase()
const idGenerator = new IdGenerator()
const userDatabase = new UserDatabase()
const authenticator = new Authenticator()

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

            const validateToken = authenticator.getTokenData(token)
            if (!validateToken) {
                throw new InvalidToken()
            }

            const result = await recipeDatabase.getAllRecipes()
            const resultOutput: GetAllRecipeOutputDTO[] = result.map((recipe) => {
                return {
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    createdAt: recipe.created_at,
                    authorId: recipe.author_id
                }
            })

            return resultOutput

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };

    getRecipeById = async(token: string, id: string) => {
        try {
            
            if (!token) {
                throw new Unauthorized()
            }

            const validateToken = authenticator.getTokenData(token)
            if (!validateToken) {
                throw new InvalidToken()
            }

            if (!id || id === ":id") {
                throw new CustomError(400, "Recipe ID not informed.")
            }

            const result = await recipeDatabase.getRecipeById(id)

            if (!result) {
                throw new RecipeNotFound()
            }

            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };

    getFeed = async(token: string, userId: string) => {

        try {

            if (!token) {
                throw new Unauthorized()
            }

            const validateToken = authenticator.getTokenData(token)
            if (!validateToken) {
                throw new InvalidToken()
            }

            const findUser = await userDatabase.getProfile(userId)
            if (!findUser) {
                throw new UserNotFound()
            }

            const following = await userDatabase.getFollowListByUsersId(userId)

            const allRecipes = []

            for (let i = 0; i < following.length; i++) {
                const recipesByUser = await recipeDatabase.getRecipesByAuthorId(following[i].following_id)
                if (recipesByUser.length > 0) {
                    allRecipes.push(...recipesByUser)
                }
            }

            if (allRecipes.length === 0) {
                throw new CustomError(400, "No recipes found.")
            }

            return allRecipes
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };

    editRecipe = async(token: string, userId: string, input: EditRecipeInput): Promise<void> => {
        try {

            const {id, title, description} = input

            if (!token) {
                throw new Unauthorized()
            }

            const validateToken = authenticator.getTokenData(token)
            if (!validateToken) {
                throw new InvalidToken()
            }

            if (!id && !title && !description) {
                throw new MissingDataEdit()
            }

            if (!id || id === ":id") {
                throw new CustomError(400, "Recipe id not informed.")
            }

            const getRecipe = await recipeDatabase.getRecipeById(id)

            if (!getRecipe) {
                throw new RecipeNotFound()
            }

            if (title && title.length < 2) {
                throw new MissingTitle()
            }

            if (description && description.length < 5) {
                throw new MissingDescription()
            }

            if (!title) {
                title === getRecipe.title
            }

            if (!description) {
                description === getRecipe.description
            }

            if (getRecipe.author_id !== userId) {
                throw new CustomError(400, 'You must be the author of this recipe to edit it.')
            }

            const recipe: EditRecipeInput = {id, title, description}

            await recipeDatabase.editRecipe(recipe)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };

    deleteRecipe = async(token: string, userId: string, userRole: string, recipeId: string): Promise<void> => {
        try {

            if (!token) {
                throw new Unauthorized()
            }

            const validateToken = authenticator.getTokenData(token)
            if (!validateToken) {
                throw new InvalidToken()
            }

            if (!recipeId || recipeId === ":id") {
                throw new CustomError(400, "Recipe id not informed.")
            }

            const getRecipe = await recipeDatabase.getRecipeById(recipeId)

            if (!getRecipe) {
                throw new RecipeNotFound()
            }

            if (userRole === "NORMAL" && getRecipe.author_id !== userId) {
                throw new CustomError(400, 'You must be the author of this recipe to delete it.')
            }

            await recipeDatabase.deleteRecipe(recipeId)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };
}