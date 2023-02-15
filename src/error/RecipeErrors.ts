import { CustomError } from "./CustomError";

export class MissingData extends CustomError {
    constructor() {
        super(400, "Provide recipe title, description and author id to continue.")
    }
}

export class MissingTitle extends CustomError {
    constructor() {
        super(400, "Your recipe title must have at least 3 characters.")
    }
}

export class MissingDescription extends CustomError {
    constructor() {
        super(400, "Your recipe description must have at least 5 characters.")
    }
}

export class MissingDataEdit extends CustomError {
    constructor() {
        super(400, "Provide recipe title and description to continue.")
    }
}

export class RecipeNotFound extends CustomError {
    constructor() {
        super(400, "Recipe ID informed not found.")
    }
}