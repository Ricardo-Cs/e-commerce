// locker-api/src/modules/payments/payment.controller.ts
import type { Request, Response, NextFunction } from "express";
import { PaymentService } from "./payment.service";

const service = new PaymentService();

export class PaymentController {
    async checkout(req: Request, res: Response, next: NextFunction) {
        try {
            const userPayload = (req as any).user;

            const result = await service.createPixPayment({
                ...req.body,
                userId: userPayload.id,
            });

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            await service.processWebhook(req.body);
            return res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

}