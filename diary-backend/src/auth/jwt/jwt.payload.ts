export type AuthPayload = {
    id: number
}

export interface JwtAuthPayload extends AuthPayload {
    iat: number
    exp: number
}
