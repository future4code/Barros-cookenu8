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
    };

    follow = async(req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization as string
            const authenticationData = authenticator.getTokenData(token)
            const userId = authenticationData.id
            const followId = req.params.id

            const input = {userId, followId}
            await userBusiness.follow(input)

            res.status(200).send({message: "User followed!"})

        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    };

    unfollow = async(req: Request, res: Response): Promise<void> => {
        
        try {
            const token = req.headers.authorization as string
            const authenticationData = authenticator.getTokenData(token)
            const userId = authenticationData.id
            const followId = req.params.id

            const input = {userId, followId}
            await userBusiness.unfollow(input)

            res.status(200).send({message: "User unfollowed!"})

        } catch (error:any) {
            res.status(error.statusCode || 400).send(error.message || error.sqlMessage)
        }
    }
}