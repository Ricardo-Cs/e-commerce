import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const paymentController = new PaymentController();

router.post("/checkout", authMiddleware, (req, res, next) => paymentController.checkout(req, res, next));

// Endpoint público para receber notificações do Mercado Pago
router.post("/webhook", (req, res, next) => paymentController.handleWebhook(req, res, next));

export default router;