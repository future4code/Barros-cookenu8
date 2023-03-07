import { CustomError } from "./CustomError";

export class MissingData extends CustomError {
    constructor() {
        super(400, "You must provided 'name', 'email', 'password' and 'role' to continue.")
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

export class InvalidPassword extends CustomError {
    constructor() {
        super(400, "Password must be at least 6 characters.")
    }
}

export class RoleNotFound extends CustomError {
    constructor() {
        super(400, "'Role' must be 'ADMIN' or 'NORMAL'.")
    }
}

export class EmailInUse extends CustomError {
    constructor() {
        super(400, "The informed e-mail address is already in use.")
    }
}

export class UserNotFound extends CustomError {
    constructor() {
        super(400, "User not found on database.")
    }
}

export class WrongPassword extends CustomError {
    constructor() {
        super(400, "Wrong password.")
    }
}

export class Unauthorized extends CustomError {
    constructor() {
        super(404, "Inform a valid token to continue.")
    }
}

export class InvalidToken extends CustomError {
    constructor() {
        super (404, "The token informed is not valid.")
    }
}