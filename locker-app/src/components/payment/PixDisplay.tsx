// locker-app/src/components/payment/PixDisplay.tsx
"use client";

import {
  Check,
  CheckCircle,
  Clipboard,
  Copy,
  Loader2,
  MapPin,
  Package,
  QrCode,
  Timer,
  Wallet,
  X,
  Clock,
  ShoppingBag,
} from "lucide-react";
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
  qrCode: string;
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

  if (paymentStatus === "APPROVED") {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-50 p-4 rounded-full mb-6 ring-8 ring-green-50/50">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0D0D0D] mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
            Seu pagamento para o pedido{" "}
            <span className="font-mono font-bold text-[#0D0D0D]">#{String(orderId).padStart(4, "0")}</span> foi
            processado com sucesso.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full mb-8 text-left hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-white p-3 rounded-lg border shadow-sm shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Ponto de Retirada</h3>
                <p className="text-gray-600 mt-1 leading-snug">
                  Locker Boutique - Shopping Rio Branco
                  <br />
                  Av. Ceará, 2500 - Loja 104
                  <br />
                  <span className="text-sm text-gray-500">Rio Branco, AC</span>
                </p>
              </div>
            </div>

            <div className="grid gap-3 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  Seu pedido estará pronto em <strong>até 2 horas</strong>.
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Package className="w-4 h-4 text-primary" />
                <span>Apresente o número do pedido ou QR Code no balcão.</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button asChild className="flex-1 h-12 text-base bg-[#0D0D0D] hover:bg-gray-800 shadow-lg">
              <Link href="/profile">
                <Package className="w-4 h-4 mr-2" />
                Ver Meus Pedidos
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-12 text-base border-gray-300">
              <Link href="/products">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Finalizar com Pix</h1>

        <div
          className={cn(
            "mt-2 mb-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            currentStatus.color
          )}
        >
          {currentStatus.icon}
          {currentStatus.label}
        </div>

        <p className="text-xl font-semibold mt-4">
          Valor: <span className="text-primary">{formatCurrency(totalPrice)}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Pedido Nº: <span className="font-mono">{String(orderId).padStart(6, "0")}</span>
        </p>
      </div>

      {paymentStatus === "PENDING" && (
        <>
          <div className="w-64 h-64 mx-auto border-4 border-primary/20 rounded-lg p-2 mb-6 bg-white">
            {qrCodeBase64 ? (
              <img
                src={`data:image/jpeg;base64,${qrCodeBase64}`}
                alt="QR Code Pix"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-center text-gray-700">Ou use o Pix Copia e Cola</h2>
            <div className="relative flex items-center">
              <div className="w-full border border-gray-300 rounded-lg p-3 pr-12 bg-gray-50 font-mono text-xs text-gray-500 truncate">
                {qrCode}
              </div>
              <Button size="icon" variant="ghost" className="absolute right-1 hover:bg-gray-200" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
              </Button>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-gray-400">
            O pagamento expira em 24 horas. Após o pagamento, aguarde nesta tela.
          </div>
        </>
      )}

      {(paymentStatus === "CANCELED" || paymentStatus === "EXPIRED") && (
        <div className="text-center mt-8 space-y-6">
          <div className="bg-red-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center">
            <Wallet className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-gray-600">
            Não foi possível confirmar seu pagamento dentro do prazo ou ele foi cancelado.
          </p>
          <Button asChild className="w-full">
            <Link href="/cart">Tentar Novamente</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
