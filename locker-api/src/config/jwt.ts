import { env } from "./env";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const SECRET: Secret = env.JWT_SECRET;

export interface JwtPayload {
    id: number;
    isAdmin: boolean;
    name: string;
}

export function generateToken(payload: JwtPayload, expiresIn = 3600) {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, SECRET) as JwtPayload;
}
