// locker-app/src/app/checkout/[orderId]/page.tsx (FINAL)
"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { PixDisplay } from "@/components/payment/PixDisplay";
import { Loader2 } from "lucide-react";
import { ordersApi } from "@/lib/api/endpoints"; // NOVO: Importa ordersApi
import { toast } from "sonner";

interface PaymentData {
  orderId: number;
  totalPrice: number;
  qrCodeBase64: string;
  qrCode: string;
}

type PaymentStatus = "PENDING" | "APPROVED" | "CANCELED" | "EXPIRED";

export default function CheckoutPage() {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("PENDING");
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const orderId = Number(params.orderId);
  const router = useRouter();

  const fetchStatus = async (id: number): Promise<PaymentStatus> => {
    try {
      const result = await ordersApi.getStatus(id);
      const newStatus = result.status as PaymentStatus;
      setPaymentStatus(newStatus);

      if (newStatus === "APPROVED") {
        toast.success(`Pedido #${id} Aprovado!`);
      }

      return newStatus;
    } catch (error) {
      console.error("Erro ao buscar status do pedido:", error);
      return paymentStatus;
    }
  };

  useEffect(() => {
    if (!orderId || isNaN(orderId)) {
      setIsLoading(false);
      router.push("/");
      return;
    }
    const storedData = sessionStorage.getItem(`payment-${orderId}`);

    if (storedData) {
      const data: PaymentData = JSON.parse(storedData);
      setPaymentData(data);
      setIsLoading(false);
    } else {
      console.warn(`Dados de pagamento para o pedido ${orderId} não encontrados.`);
      router.push("/");
      setIsLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (paymentData && paymentStatus === "PENDING") {
      intervalId = setInterval(async () => {
        const status = await fetchStatus(paymentData.orderId);
        if (status !== "PENDING") {
          clearInterval(intervalId);
        }
      }, 5000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentData, paymentStatus]);

  if (isLoading || !paymentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Carregando detalhes do pagamento...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-[#0D0D0D] py-12">
      <PixDisplay
        orderId={paymentData.orderId}
        totalPrice={paymentData.totalPrice}
        qrCodeBase64={paymentData.qrCodeBase64}
        qrCode={paymentData.qrCode}
        paymentStatus={paymentStatus}
      />
    </div>
  );
}
