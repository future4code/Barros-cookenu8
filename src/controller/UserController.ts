import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { LoginInputDTO, UserInputDTO } from "../model/userDTO";

const userBusiness = new UserBusiness()

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
    }
}