import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod"; // Importa 'z' aqui

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ZodError) {
        const validationErrors = z.treeifyError(error);
        return res.status(400).json({
            message: "Erro de validação",
            errors: validationErrors,
        });
    }

    if (error instanceof Error) {
        if (error.message === "Email ou senha incorretos!") {
            return res.status(401).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erro interno do servidor" });
    }

    return res.status(500).json({ error: "Erro desconhecido" });
};