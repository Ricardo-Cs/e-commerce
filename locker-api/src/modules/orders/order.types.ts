import { Decimal } from "@prisma/client/runtime/library";

export interface OrderItemInput {
    product_id_fk: number;
    quantity: number;
    price: Decimal;
}

export interface CreateOrderInput {
    user_id_fk: number;
    total: Decimal;
    items: OrderItemInput[];
}