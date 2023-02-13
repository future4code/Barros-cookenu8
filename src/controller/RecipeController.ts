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
    }
}