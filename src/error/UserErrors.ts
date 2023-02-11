import { CustomError } from "./CustomError";

export class MissingData extends CustomError {
    constructor() {
        super(400, "You must provided 'name', 'email' and 'password' to continue.")
    }
}

export class InvalidName extends CustomError {
    constructor() {
        super(400, "Name must be at least 2 characters.")
    }
}

export class InvalidEmail extends CustomError {
    constructor() {
        super(400, "E-mail not valid.")
    }
}

export class InvalidNewPassword extends CustomError {
    constructor() {
        super(400, "Password must be at least 6 characters.")
    }
}

export class EmailInUse extends CustomError {
    constructor() {
        super(400, "The informed e-mail address is already in use.")
    }
}