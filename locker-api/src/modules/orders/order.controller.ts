// locker-api/src/modules/orders/order.controller.ts
import type { Request, Response, NextFunction } from "express";
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

    async updateStatusManually(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = Number(req.params.orderId);
            const { status } = req.body;

            if (isNaN(orderId) || !status) {
                throw new AppError("Dados inválidos (ID ou Status)", 400);
            }

            const validStatuses = ["PENDING", "APPROVED", "CANCELED", "EXPIRED"];
            const newStatus = status.toUpperCase();

            if (!validStatuses.includes(newStatus)) {
                throw new AppError("Status de pedido inválido", 400);
            }

            const updatedOrder = await repo.updateStatus(orderId, newStatus);

            return res.json({ message: "Status atualizado com sucesso", order: updatedOrder });
        } catch (error) {
            next(error);
        }
    }

    async listAllOrders(_req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await repo.findAllForAdmin();

            const formattedOrders = orders.map(order => ({
                id: order.id,
                customerName: order.user?.name || "Convidado",
                total: Number(order.total),
                status: order.status,
                createdAt: order.createdAt,
            }));

            return res.json(formattedOrders);
        } catch (error) {
            next(error);
        }
    }

    async listUserOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const orders = await repo.findByUserId(userId);
            return res.json(orders);
        } catch (error) {
            next(error);
        }
    }
}