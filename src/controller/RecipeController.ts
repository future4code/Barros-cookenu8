import { Request, Response } from "express";
import { RecipeBusiness } from "../business/RecipeBusiness";
import { RecipeInputDTO } from "../model/recipeDTO";
import { Authenticator } from "../services/Authenticator";

const authenticator = new Authenticator()
const recipeBusiness = new RecipeBusiness()

export class RecipeController {

    createRecipe = async(req: Request, res: Response): Promise<void> => {
        try {
            const userToken = req.headers.authorization as string
            const title = req.body.title
            const description = req.body.description

            const author = authenticator.getTokenData(userToken)

            const input: RecipeInputDTO = {title, description, authorId: author.id}

            await recipeBusiness.createRecipe(input)

            res.status(201).send({message: "Success! Your recipe was posted."})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    getAllRecipes = async(req: Request, res: Response): Promise<void> => {
        try {

            const userToken = req.headers.authorization as string
            const recipes = await recipeBusiness.getAllRecipes(userToken)
            
            res.status(200).send(recipes)
         
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    getRecipeById = async(req: Request, res: Response): Promise<void> => {
       try {

           const userToken = req.headers.authorization as string
           const recipeId = req.params.id as string
    
           const recipe = await recipeBusiness.getRecipeById(userToken, recipeId)
    
           res.status(200).send({
               id: recipe.id,
               title: recipe.title,
               description: recipe.description,
               createdAt: recipe.created_at
           })
        
       } catch (error:any) {
        res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
       }
    };

    getFeed = async(req: Request, res: Response): Promise<void> => {

        try {
            const userToken = req.headers.authorization as string
            const authenticatorData = authenticator.getTokenData(userToken)
    
            const result = await recipeBusiness.getFeed(userToken, authenticatorData.id)
     
            res.status(200).send({recipes: result})
         
        } catch (error:any) {
         res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };
}