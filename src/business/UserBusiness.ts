import { UserDatabase } from "../data/UserDatabase";
import { CustomError } from "../error/CustomError";
import { UserInputDTO } from "../model/userDTO";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

const userDatabase = new UserDatabase()
const idGenerator = new IdGenerator()
const authenticator = new Authenticator()
const hashManager = new HashManager()

export class UserBusiness {
    createUser = async (input: UserInputDTO) => {
        try {
            const { name, email, password } = input

            //adicionar todas as verificações

            const id: string = idGenerator.generateId()
            const cypherPassword = await hashManager.hash(password)

            const newUser = {
                id, name, email, password: cypherPassword
            }

            await userDatabase.createUser(newUser)
            const token = authenticator.generateToken({id})
            return token

        } catch (error:any) {
            throw new CustomError(error.statusCode, error.message);
        }
    }
}