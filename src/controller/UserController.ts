import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { LoginInputDTO, UserInputDTO } from "../model/userDTO";
import { Authenticator } from "../services/Authenticator";

const userBusiness = new UserBusiness()
const authenticator = new Authenticator()

export class UserController {

    signUp = async(req: Request, res: Response): Promise<void> => {
        try {

            const input: UserInputDTO = {
                name: req.body.name,
                password: req.body.password,
                email: req.body.email
            }

            const token = await userBusiness.createUser(input)

            res.status(201).send({message: "Success!", token})

        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    login = async(req: Request, res: Response): Promise<void> => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }

            const token = await userBusiness.login(input)

            res.status(200).send({message: "Success!", token})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    getProfile = async(req: Request, res:Response): Promise<void> => {
        try {

            const token = req.headers.authorization as string
            const authenticationData = authenticator.getTokenData(token)
            const user = await userBusiness.getProfile(token, authenticationData.id)

            res.status(200).send({id: user.id, name: user.name, email: user.email})
        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    getOtherProfile = async(req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string
            const userId = req.params.id

            const user = await userBusiness.getProfile(token, userId)
            res.status(200).send({id: user.id, name: user.name, email: user.email})

        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}