import type { Request, Response } from "express"
import { ProductService } from "./product.service"

const service = new ProductService()

export class ProductController {
    async getAll(req: Request, res: Response) {
        const products = await service.getAll();
        res.json(products);
    }

    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const product = await service.getById(id);
        res.json(product);
    }

    async create(req: Request, res: Response) {
        const product = await service.create(req.body);
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
