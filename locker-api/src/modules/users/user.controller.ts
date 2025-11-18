import type { Request, Response } from "express";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {
    async getAll(_req: Request, res: Response) {
        const users = await service.getAll();
        res.json(users);
    }

    async getOne(req: Request, res: Response) {
        const user = await service.getOne((req as any).user);
        res.json(user);
    }

    async getOneById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const user = await service.getOneById(id);
        res.json(user);
    }

    async create(req: Request, res: Response) {
        const user = await service.create(req.body);
        res.status(201).json(user);
    }

    async update(req: Request, res: Response) {
        const userPayload = (req as any).user;
        const user = await service.update(userPayload, req.body);
        res.json(user);
    }
}