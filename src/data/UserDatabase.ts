import { CustomError } from "../error/CustomError";
import { User } from "../model/userDTO";
import { BaseDatabase } from "./BaseDatebase";

export class UserDatabase extends BaseDatabase {

    createUser = async(user: User): Promise<void> => {
        try {
            await UserDatabase.connection("Users_Cookenu").insert(
                {   
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password
                }
            )
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    getUserByEmail = async (email: string): Promise<User> => {
        try {
            const result = await UserDatabase.connection("Users_Cookenu")
            .select()
            .where({email: email})

            return result[0]
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}