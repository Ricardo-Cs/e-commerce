import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../config/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token não fornecido" });

    const [, token] = authHeader.split(" ");

    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}
