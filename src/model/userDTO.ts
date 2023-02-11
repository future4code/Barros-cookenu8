export interface User {
    id: string,
    name: string,
    email: string,
    password: string
}

export interface UserInputDTO {
    name: string,
    email: string,
    password: string
}

export interface LoginInputDTO {
    email: string,
    password: string
}

export interface InsertFollowingDTO {
    id: string,
    userId: string,
    followId: string
}

export interface FollowInputDTO {
    userId: string,
    followId: string
}