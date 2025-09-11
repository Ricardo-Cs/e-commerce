import { env } from "./env";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const SECRET: Secret = env.JWT_SECRET;

export function generateToken(payload: object, expiresIn = 1) {
    const options: SignOptions = { expiresIn }
    return jwt.sign(payload, SECRET, options);
}

export function verifyToken<T>(token: string) {
    return jwt.verify(token, SECRET) as T;
}