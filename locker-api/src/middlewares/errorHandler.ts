import type { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { AppError } from "../errors/AppError.js";

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

    if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
    }

    console.error(error); // opcional, útil para debugging
    return res.status(500).json({ error: "Erro interno do servidor" });
};
