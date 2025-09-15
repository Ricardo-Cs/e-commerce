import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) throw new AppError("Usuário não autenticado", 401);
    if (!user.isAdmin) throw new AppError("Acesso negado: Admins apenas", 403);

    next();
};
