import type { Request, Response } from "express"
import { CategoryService } from "./category.service";

const service = new CategoryService();

export class CategoryController {
    async getAll(req_: Request, res: Response) {
        const categories = await service.getAll();
        res.json(categories);
    }

    async create(req: Request, res: Response) {
        const category = await service.create(req.body);
        res.json(category);
    }


    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const category = await service.update(id, req.body);
        res.json(category);
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await service.delete(id);
        res.status(204).send("Categoria deletada com sucesso");
    }
}