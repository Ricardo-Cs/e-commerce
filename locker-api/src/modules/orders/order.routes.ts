import { Router } from "express";
import { OrderController } from "./order.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const orderController = new OrderController();

// Rota protegida para consultar o status do pedido (o frontend precisa estar logado)
router.get("/:orderId/status", authMiddleware, (req, res, next) => {
    orderController.getStatusById(req, res).catch(next);
});

export default router;