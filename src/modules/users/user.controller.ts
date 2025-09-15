import type { Request, Response } from "express";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {
    async create(req: Request, res: Response) {
        const user = await service.create(req.body);
        res.status(201).json(user);
    }

    async getAll(req: Request, res: Response) {
        const users = await service.getAll();
        res.json(users);
    }
}