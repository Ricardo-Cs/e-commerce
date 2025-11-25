import { AppError } from "../../errors/AppError";
import { env } from "../../config/env";
import { OrderRepository } from "../orders/order.repository";
import { checkoutSchema } from "./payment.schema";
import { MercadoPagoPaymentResponse } from "./payment.types";
import { randomUUID } from "crypto";

type Decimal = any;

const orderRepo = new OrderRepository();
const MERCADO_PAGO_API_URL = "https://api.mercadopago.com/v1/payments";

export class PaymentService {
    async createPixPayment(input: unknown & { userId: number }): Promise<MercadoPagoPaymentResponse> {
        const validatedInput = checkoutSchema.parse(input);
        const { items, total, userEmail, userName, userId } = validatedInput;

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

        const paymentPayload = {
            transaction_amount: total,
            description: `Pedido #${newOrder.id} - E-commerce Locker`,
            payment_method_id: "pix",
            payer: {
                email: userEmail,
                first_name: userName.split(" ")[0],
                last_name: userName.split(" ").slice(1).join(" ") || "Cliente",
            },
            external_reference: String(newOrder.id), // Chave para rastreio no Webhook
            notification_url: `${env.API_URL}/payments/webhook`,
        };

        try {

            const response = await fetch(MERCADO_PAGO_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
                    "X-Idempotency-Key": randomUUID(),
                },
                body: JSON.stringify(paymentPayload),
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
            console.error("Erro na comunicação com MP:", error);
            throw new AppError("Erro ao processar pagamento externo", 500);
        }
    }

    // Lida com as notificações de status do Mercado Pago
    async processWebhook(query: any) {
        // O Mercado Pago envia um ID de pagamento na query (id ou data.id)
        const paymentId = query.id || query["data.id"];
        if (!paymentId || query.topic !== "payment") return;

        const response = await fetch(`${MERCADO_PAGO_API_URL}/${paymentId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
            },
        });

        const data = await response.json() as any;

        const orderId = Number(data.external_reference);
        const status = data.status.toUpperCase();

        if (orderId && status) {
            await orderRepo.updateStatus(orderId, status);

            if (status === "APPROVED") {
                console.log(`Pedido ${orderId} APROVADO. Estoque deve ser reduzido aqui.`);
            }
        }
    }
}