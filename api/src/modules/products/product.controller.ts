import type { Request, Response } from "express"
import { ProductService } from "./product.service"

const service = new ProductService()

export class ProductController {
    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const product = await service.getById(id);
        res.json(product);
    }

    async listWithPagination(req: Request, res: Response) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const paginatedData = await service.getWithPagination(page, limit);

        res.json(paginatedData);
    }

    async create(req: Request, res: Response) {
        const product = await service.create(req.body);
        res.status(201).json(product);
    }

    async createMany(req: Request, res: Response) {
        const product = await service.createMany(req.body);
        res.status(201).json(product);
    }

    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const product = await service.update(id, req.body);
        res.json(product);
    }

    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await service.delete(id);
        res.status(204).send();
    }
}
