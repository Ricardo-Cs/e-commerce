"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/endpoints";
import { formatCurrency } from "@/lib/utils";

interface Order {
  id: number;
  customerName: string;
  total: number;
  status: "PENDING" | "APPROVED" | "CANCELED" | "EXPIRED";
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingOrderId, setLoadingOrderId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.listAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Falha ao carregar a lista de pedidos.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, status: "APPROVED" | "CANCELED") => {
    setLoadingOrderId(orderId);
    try {
      await ordersApi.updateStatusManually(orderId, status);

      await fetchOrders();

      toast.success(`Pedido #${orderId} atualizado para ${status}!`);
    } catch {
      toast.error("Falha ao atualizar.");
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getStatusDisplay = (status: Order["status"]) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3 mr-1" /> APROVADO
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 mr-1" /> PENDENTE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
            <X className="w-3 h-3 mr-1" /> CANCELADO
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  if (orders.length === 0) return <p className="container py-12 max-w-6xl mx-auto">Nenhum pedido encontrado.</p>;

  return (
    <div className="container py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-8">Administração de Pedidos</h1>
      <Card className="p-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      #{String(order.id).padStart(4, "0")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusDisplay(order.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {order.status === "PENDING" ? (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleUpdateStatus(order.id, "APPROVED")}
                          disabled={loadingOrderId === order.id}
                        >
                          {loadingOrderId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aprovar PIX"}
                        </Button>
                      ) : (
                        <span className="text-gray-400 italic">Concluído</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
