export interface Recipe {
    id: string,
    title: string,
    description: string,
    created_at: Date,
    author_id: string
}

export interface RecipeInputDTO {
    title: string,
    description: string,
    authorId: string
}

export interface InsertRecipeDTO {
    id: string,
    title: string,
    description: string,
    authorId: string
}

export interface RecipeOutputDTO {
    id: string,
    title: string,
    description: string,
    createdAt: string
}

export interface GetAllRecipeOutputDTO {
    id: string,
    title: string,
    description: string,
    createdAt: Date,
    authorId: string
}

export interface EditRecipeInput {
    id: string,
    title: string,
    description: string
}