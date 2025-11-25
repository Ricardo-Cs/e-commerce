export interface CartItem {
    id: number;
    price: number;
    quantity: number;
}

export interface CheckoutInput {
    items: CartItem[];
    total: number;
    userEmail: string;
    userName: string;
}

export interface MercadoPagoPaymentResponse {
    qrCode: string; // Código Pix Copia e Cola
    qrCodeBase64: string; // QR Code em Base64
    paymentId: number;
    orderId: number;
}