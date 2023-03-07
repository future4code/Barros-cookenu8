export interface User {
    id: string,
    name: string,
    email: string,
    password: string,
    role: string
}

export interface UserInputDTO {
    name: string,
    email: string,
    password: string,
    role: string
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

export interface FollowOutputDTO {
    id: string,
    user_id: string,
    following_id: string
}