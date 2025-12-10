"use client";

import { useState, useEffect } from "react";
import { ordersApi } from "@/lib/api/endpoints";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface Order {
  id: number;
  customerName: string;
  total: number;
  status: "PENDING" | "APPROVED" | "CANCELED" | "EXPIRED";
  createdAt: string;
}

export function AdminOrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.listAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Erro ao carregar pedidos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    setProcessingId(orderId);
    try {
      await ordersApi.updateStatusManually(orderId, status);
      await fetchOrders();
      toast.success(`Status atualizado para ${status}`);
    } catch {
      toast.error("Falha ao atualizar status.");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      CANCELED: "bg-red-100 text-red-700 border-red-200",
      EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.EXPIRED}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-semibold">Pedidos Recentes</h2>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
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
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Sem pedidos.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        #{order.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {order.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 h-8"
                              disabled={processingId === order.id}
                              onClick={() => handleUpdateStatus(order.id, "APPROVED")}
                              title="Aprovar Pagamento"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              disabled={processingId === order.id}
                              onClick={() => handleUpdateStatus(order.id, "CANCELED")}
                              title="Cancelar Pedido"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        {order.status === "APPROVED" && (
                          <span className="text-xs text-gray-400 italic">Processado</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
