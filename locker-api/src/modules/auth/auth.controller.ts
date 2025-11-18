import { generateToken, type JwtPayload } from "../../config/jwt";
import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";

const service = new AuthService();

export class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const login = await service.login({ email, password });
            if (login.login) {
                const payload: JwtPayload = { id: login.id, isAdmin: login.isAdmin }
                const token = generateToken(payload);
                return res.json({ token });
            }
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = req.body;

            const registedUser = await service.register({ email, password, name });
            return res.json({ usuario: registedUser });
        } catch (error) {
            next(error);
        }
    }
}