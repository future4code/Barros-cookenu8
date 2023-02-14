import { CustomError } from "../error/CustomError";
import { FollowOutputDTO, InsertFollowingDTO, User } from "../model/userDTO";
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
    };
 
    getProfile = async (id: string): Promise<User> => {
        try {
            const result = await UserDatabase.connection("Users_Cookenu")
            .select()
            .where({id: id})

            return result[0]
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    follow = async(input: InsertFollowingDTO): Promise<void> => {
        try {
            await UserDatabase.connection("Users_Followers_Cookenu")
            .insert({
                id: input.id,
                user_id: input.userId,
                following_id: input.followId
            })
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    unfollow = async(id: string): Promise<void> => {
        try {

            await UserDatabase.connection("Users_Followers_Cookenu")
            .delete()
            .where({id})

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    };

    getFollowListByUsersId = async(userId: string): Promise<FollowOutputDTO[]> => {
        try {

            const result = await UserDatabase.connection("Users_Followers_Cookenu")
            .select()
            .where({user_id: userId})

            return result
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
    
}