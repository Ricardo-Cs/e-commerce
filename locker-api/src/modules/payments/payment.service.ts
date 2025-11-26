// locker-api/src/modules/payments/payment.service.ts
import { AppError } from "../../errors/AppError";
import { env } from "../../config/env";
import { OrderRepository } from "../orders/order.repository";
import { checkoutSchema } from "./payment.schema";
import { randomUUID } from "crypto";

type Decimal = any;

const orderRepo = new OrderRepository();
const MP_PAYMENTS_URL = "https://api.mercadopago.com/v1/payments";

export class PaymentService {
    async createPixPayment(input: unknown & { userId: number }) {
        const validatedInput = checkoutSchema.parse(input);
        const { items, total, userId } = validatedInput;

        const orderItems = items.map(item => ({
            product_id_fk: item.id,
            quantity: item.quantity,
            price: item.price as Decimal,
        }));

        const newOrder = await orderRepo.createOrderAndItems({
            user_id_fk: userId,
            total: total as Decimal,
            items: orderItems,
        });

        // --- Payload Pix sandbox ---
        const payload = {
            transaction_amount: total,
            payment_method_id: "pix",
            payer: {
                email: "test_user@example.com",
                first_name: "APRO",
                last_name: "BUYER",
            },
            external_reference: String(newOrder.id),
            // notification_url: `${env.API_URL}/payments/webhook`,
        };

        try {
            const response = await fetch(MP_PAYMENTS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    "X-Idempotency-Key": randomUUID(),
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json() as any;

            if (!response.ok) {
                console.error("Erro MP:", data);
                throw new AppError(data.message || "Falha ao gerar Pix", 400);
            }

            await orderRepo.createPayment(newOrder.id, "PIX", data.status);

            const transactionData = data.point_of_interaction.transaction_data;

            return {
                qrCode: transactionData.qr_code,
                qrCodeBase64: transactionData.qr_code_base64,
                paymentId: data.id,
                orderId: newOrder.id,
            };

        } catch (error) {
            console.error("Erro MP Pix:", error);
            throw new AppError("Erro ao processar pagamento externo", 500);
        }
    }

    async processWebhook(body: any) {
        const paymentId = body.data?.id || body.id;
        const actionType = body.type || body.topic;

        if (!paymentId || actionType !== "payment") {
            return;
        }

        try {
            const response = await fetch(`${MP_PAYMENTS_URL}/${paymentId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}` },
            });

            if (!response.ok) {
                console.error(`Erro ao buscar pagamento ${paymentId} no MP`);
                return;
            }

            const data = await response.json() as any;

            const orderId = Number(data.external_reference);
            const status = data.status?.toUpperCase();

            if (orderId && status) {
                await orderRepo.updateStatus(orderId, status);
                console.log(`Webhook: Pedido #${orderId} atualizado para ${status}`);
            }
        } catch (error) {
            console.error("Erro ao processar webhook:", error);
        }
    }
}
