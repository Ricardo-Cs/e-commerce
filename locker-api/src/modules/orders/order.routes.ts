// locker-api/src/modules/orders/order.routes.ts
import { Router } from "express";
import { OrderController } from "./order.controller";
import { authMiddleware } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/isAdmin";

const router = Router();
const orderController = new OrderController();

router.get("/", authMiddleware, isAdmin, (req, res, next) => {
    orderController.listAllOrders(req, res, next).catch(next);
});

router.get("/:orderId/status", authMiddleware, (req, res, next) => {
    orderController.getStatusById(req, res).catch(next);
});

router.put("/:orderId/status", authMiddleware, isAdmin, (req, res, next) => {
    orderController.updateStatusManually(req, res, next);
});

export default router;