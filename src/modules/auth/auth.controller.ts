import { generateToken } from "../../config/jwt";
import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body as any;

            if (await service.login({ email, password })) {
                const token = generateToken({ userId: 1, role: "admin" });
                return res.json({ token });
            }
        } catch (error) {
            next(error);
        }
    }
}