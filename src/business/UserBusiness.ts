import { RecipeDatabase } from "../data/RecipeDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { EmailInUse, InvalidEmail, InvalidName, InvalidPassword, InvalidToken, MissingData, RoleNotFound, Unauthorized, UserNotFound, WrongPassword } from "../error/UserErrors";
import { FollowInputDTO, InsertFollowingDTO, LoginInputDTO, User, UserInputDTO } from "../model/userDTO";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/idGenerator";

const userDatabase = new UserDatabase()
const recipeDatabase = new RecipeDatabase()
const idGenerator = new IdGenerator()
const authenticator = new Authenticator()
const hashManager = new HashManager()

export class UserBusiness {
    createUser = async (input: UserInputDTO) => {
        try {

            const { name, email, password, role } = input

            if (!name && !email && !password && !role) {
                throw new MissingData()
            }

            if (!name || name.length < 2) {
                throw new InvalidName()
            }

            if (!email || !email.includes("@")) {
                throw new InvalidEmail()
            }

            if (!password || password.length < 6) {
                throw new InvalidPassword()
            }

            if (role.toUpperCase() !== "NORMAL" && role.toUpperCase() !== "ADMIN") {
                throw new RoleNotFound()
            }

            const emailInUse = await userDatabase.getUserByEmail(email)
            if (emailInUse) {
                throw new EmailInUse()
            }

            const id: string = idGenerator.generateId()
            const cypherPassword = await hashManager.hash(password)

            const newUser = {
                id, name, email, password: cypherPassword, role: role.toUpperCase()
            }

            await userDatabase.createUser(newUser)
            const token = authenticator.generateToken({id, role})
            return token

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message);
        }
    };

    login = async (input: LoginInputDTO) => {
        try {
            
            const { email, password } = input

            if (!email && !password) {
                throw new CustomError(400, "You must provide 'email' and 'password' to continue.")
            }

            if (!email || !email.includes("@")) {
                throw new InvalidEmail()
            }

            if (!password || password.length < 6) {
                throw new InvalidPassword()
            }

            const user = await userDatabase.getUserByEmail(email)
            if (!user) {
                throw new UserNotFound()
            }

            const passwordIsCorrect = await hashManager.compare(password, user.password)
            if (!passwordIsCorrect) {
                throw new WrongPassword()
            }
      
            const token = authenticator.generateToken({id: user.id, role: user.role})
            return token
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message);
        }
    };

    getAllUsers = async(token: string): Promise<User[]> => {
        try {

            if (!token) {
                throw new Unauthorized()
            }

            const validateToken = authenticator.getTokenData(token)
            if (!validateToken) {
                throw new InvalidToken()
            }

            const result = await userDatabase.getAllUsers()
            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message);
        }
    };

    getProfile = async(token: string, id: string) => {
        try {
            if (!token) {
                throw new Unauthorized()
            }

            const validateToken = authenticator.getTokenData(token)
            if (!validateToken) {
                throw new InvalidToken()
            }

            const result = await userDatabase.getProfile(id)

            if (!result) {
                throw new UserNotFound()
            }
            
            return result
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message);
        };
    };

    follow = async(input: FollowInputDTO) => {
        try {
            const { userId, followId } = input

            if (!userId) {
                throw new Unauthorized()
            }

            if (!followId) {
                throw new CustomError(400, "Inform the user id to follow.")
            } 

            const user = await userDatabase.getProfile(followId)
            if (!user) {
                throw new UserNotFound()
            }

            const getFollow = await userDatabase.getFollowListByUsersId(userId)

            const getFollowId = getFollow.filter((user) => {
                return user.following_id === followId
            })

            if (getFollowId.length > 0) {
                throw new CustomError(404, "You already follow this user.")
            }

            const id = idGenerator.generateId()

            const newFollow: InsertFollowingDTO = {
                id, userId, followId
            }

            await userDatabase.follow(newFollow)
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message); 
        }
    };

    unfollow = async(input: FollowInputDTO): Promise<void> => {
        try {

            const { userId, followId } = input

            if (!userId) {
                throw new Unauthorized()
            }

            if (!followId) {
                throw new CustomError(400, "Inform user ID to unfollow.")
            }

            const getFollow = await userDatabase.getFollowListByUsersId(userId)

            const getFollowId = getFollow.filter((user) => {
                return user.following_id === followId
            })

            if (getFollowId.length === 0) {
                throw new CustomError(404, "You do not follow this user.")
            }

            await userDatabase.unfollow(getFollowId[0].id)
            
        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message);        
        }
    };

    deleteAccount = async(token: string, deleteUserId: string, userRole: string): Promise<void> => {
        try {

            if (!token) {
                throw new Unauthorized()
            }

            if (userRole.toUpperCase() !== "ADMIN") {
                throw new CustomError(400, "You must be an ADMIN user to delete an account.")
            }

            if (!deleteUserId || deleteUserId === ":id") {
                throw new CustomError(400, "User ID not informed.")
            }

            const getUser = await userDatabase.getProfile(deleteUserId)
            if (!getUser) {
                throw new UserNotFound()
            }

            const getFollowing = await userDatabase.getFollowListByUsersId(deleteUserId)
            for (let i = 0; i < getFollowing.length; i++) {
                await userDatabase.unfollow(getFollowing[i].id)
            }

            const getRecipes = await recipeDatabase.getRecipesByAuthorId(deleteUserId)
            for (let i = 0; i < getRecipes.length; i++) {
                await recipeDatabase.deleteRecipe(getRecipes[i].id)
            }

            await userDatabase.deleteAccount(deleteUserId)

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message);         
        }
    };
}