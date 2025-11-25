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

        // Criar pedido no banco local
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

        // Payload compatível com Pix sandbox
        const payload = {
            external_reference: String(newOrder.id),
            notification_url: `${env.API_URL}/payments/webhook`,
            payer: {
                first_name: "APRO",           // obrigatório para sandbox
                last_name: "BUYER",
                email: "test_user@example.com" // email fictício
            },
            payments: [
                {
                    payment_type_id: "pix",
                    transaction_amount: total
                }
            ]
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

            const payment = data.payments[0];

            await orderRepo.createPayment(newOrder.id, "PIX", data.status);

            return {
                qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
                qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
                ticketUrl: payment.point_of_interaction?.transaction_data?.ticket_url,
                orderId: newOrder.id,
                mpOrderId: data.id
            };

        } catch (error) {
            console.error("Erro MP Orders:", error);
            throw new AppError("Erro ao processar pagamento externo", 500);
        }
    }

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
