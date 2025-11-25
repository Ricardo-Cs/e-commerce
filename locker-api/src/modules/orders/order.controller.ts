// locker-api/src/modules/orders/order.controller.ts
import type { Request, Response } from "express";
import { OrderRepository } from "./order.repository";
import { AppError } from "../../errors/AppError";

const repo = new OrderRepository();

export class OrderController {
    async getStatusById(req: Request, res: Response) {
        const orderId = Number(req.params.orderId);

        if (isNaN(orderId)) {
            throw new AppError("ID de pedido inválido", 400);
        }

        const order = await repo.findStatusById(orderId);

        if (!order) {
            throw new AppError("Pedido não encontrado", 404);
        }

        return res.json({ status: order.status });
    }
}