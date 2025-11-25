// locker-app/src/components/payment/PixDisplay.tsx
"use client";

import { Check, Clipboard, Copy, Loader2, QrCode, Timer, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PixDisplayProps {
  orderId: number;
  totalPrice: number;
  qrCodeBase64: string;
  qrCode: string; // Código copia e cola
  paymentStatus?: "PENDING" | "APPROVED" | "CANCELED" | "EXPIRED";
}

export function PixDisplay({ orderId, totalPrice, qrCodeBase64, qrCode, paymentStatus = "PENDING" }: PixDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      toast.success("Código Pix copiado!", {
        description: "Cole no seu aplicativo de banco para pagar.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Falha ao copiar o código.");
    }
  };

  const statusMap = {
    PENDING: {
      label: "Aguardando Pagamento",
      icon: <Timer className="w-5 h-5 mr-2 animate-pulse text-yellow-600" />,
      color: "bg-yellow-100 text-yellow-800",
    },
    APPROVED: {
      label: "Pagamento Aprovado",
      icon: <Check className="w-5 h-5 mr-2 text-green-600" />,
      color: "bg-green-100 text-green-800",
    },
    CANCELED: {
      label: "Pagamento Cancelado",
      icon: <X className="w-5 h-5 mr-2 text-red-600" />,
      color: "bg-red-100 text-red-800",
    },
    EXPIRED: {
      label: "Pix Expirado",
      icon: <X className="w-5 h-5 mr-2 text-red-600" />,
      color: "bg-red-100 text-red-800",
    },
  };

  const currentStatus = statusMap[paymentStatus] || statusMap.PENDING;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Finalizar com Pix</h1>
        <p className={cn("text-sm font-medium px-3 py-1 rounded-full inline-flex items-center", currentStatus.color)}>
          {currentStatus.icon}
          {currentStatus.label}
        </p>
        <p className="text-xl font-semibold mt-4">
          Valor: <span className="text-primary">{formatCurrency(totalPrice)}</span>
        </p>
        <p className="text-xs text-gray-500">
          Pedido Nº: <span className="font-mono">{String(orderId).padStart(6, "0")}</span>
        </p>
      </div>

      {paymentStatus === "PENDING" && (
        <>
          <div className="w-64 h-64 mx-auto border-4 border-primary/20 rounded-lg p-2 mb-6">
            {qrCodeBase64 ? (
              // O QR Code Base64 do Mercado Pago é uma string JPEG
              <img
                src={`data:image/jpeg;base64,${qrCodeBase64}`}
                alt="QR Code Pix"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-100">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Botão Copia e Cola */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center">Ou use o Pix Copia e Cola</h2>
            <div className="relative border border-gray-300 rounded-lg p-3 break-all text-sm bg-gray-50">
              <span className="text-gray-600 select-all">{qrCode}</span>
              <Button
                size="icon-sm"
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 border-gray-200"
                onClick={handleCopy}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">O pagamento expira em 24 horas.</div>
        </>
      )}

      {(paymentStatus === "APPROVED" || paymentStatus === "CANCELED" || paymentStatus === "EXPIRED") && (
        <div className="text-center mt-8 space-y-4">
          <Wallet className="w-12 h-12 text-primary mx-auto" />
          <p className="text-gray-600">
            {paymentStatus === "APPROVED"
              ? "Seu pedido foi confirmado e será processado."
              : "Não é possível prosseguir com o pagamento."}
          </p>
          <Button asChild>
            <Link href="/products">Continuar Comprando</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
