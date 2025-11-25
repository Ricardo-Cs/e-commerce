import { AppError } from "../../errors/AppError";
import { env } from "../../config/env";
import { OrderRepository } from "../orders/order.repository";
import { checkoutSchema } from "./payment.schema";
import { randomUUID } from "crypto";

type Decimal = any;

const orderRepo = new OrderRepository();
const MP_ORDERS_URL = "https://api.mercadopago.com/v1/orders";

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

        // --- Orders API payload para sandbox Pix ---
        const payload = {
            external_reference: String(newOrder.id),
            type: "online",
            notification_url: `${env.API_URL}/payments/webhook`,
            payer: {
                email: "test@testuser.com",  // qualquer email fictício
                first_name: "APRO",          // força aprovação no sandbox
                last_name: "BUYER"
            },
            transactions: {
                payments: [
                    {
                        amount: total,
                        payment_method: {
                            id: "pix",
                            type: "bank_transfer"
                        }
                    }
                ]
            }
        };

        try {
            const response = await fetch(MP_ORDERS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    "X-Idempotency-Key": randomUUID()
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json() as any;

            if (!response.ok) {
                console.error("Erro MP:", data);
                throw new AppError(data.message || "Falha ao gerar Pix", 400);
            }

            const charge = data.charges[0];
            const payment = charge.payment_method;

            await orderRepo.createPayment(newOrder.id, "PIX", data.status);

            return {
                qrCode: payment.qr_code,
                qrCodeBase64: payment.qr_code_base64,
                ticketUrl: payment.ticket_url,
                orderId: newOrder.id,
                mpOrderId: data.id
            };

        } catch (error) {
            console.error("Erro MP Orders:", error);
            throw new AppError("Erro ao processar pagamento externo", 500);
        }
    }

    // ------ Webhook ------
    async processWebhook(body: any) {
        const orderId = body.data?.id;
        if (!orderId) return;

        const response = await fetch(`${MP_ORDERS_URL}/${orderId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
            },
        });

        const data = await response.json() as any;

        const externalRef = Number(data.external_reference);
        const status = data.status?.toUpperCase();

        if (externalRef && status) {
            await orderRepo.updateStatus(externalRef, status);

            if (status === "APPROVED") {
                console.log(`Pedido ${externalRef} aprovado.`);
            }
        }
    }
}
