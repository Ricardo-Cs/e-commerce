"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Package, User, Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  quantity: number;
  price: string | number;
  product: {
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  total: string | number;
  status: "PENDING" | "APPROVED" | "CANCELED" | "EXPIRED";
  createdAt: string;
  items: OrderItem[];
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  async function fetchData() {
    try {
      const [userData, ordersData] = await Promise.all([api.get("/users/me"), api.get("/orders/me")]);

      if (userData) setUser(userData);
      if (ordersData) setOrders(ordersData);
    } catch (error) {
      toast.error("Erro ao carregar perfil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      CANCELED: "bg-red-100 text-red-700 border-red-200",
      EXPIRED: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const icons = {
      PENDING: <Clock className="w-3 h-3 mr-1" />,
      APPROVED: <CheckCircle className="w-3 h-3 mr-1" />,
      CANCELED: <XCircle className="w-3 h-3 mr-1" />,
      EXPIRED: <AlertTriangle className="w-3 h-3 mr-1" />,
    };

    const statusKey = status as keyof typeof styles;

    return (
      <span
        className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          styles[statusKey] || styles.EXPIRED
        }`}
      >
        {icons[statusKey]}
        {status === "PENDING"
          ? "Pendente"
          : status === "APPROVED"
          ? "Aprovado"
          : status === "CANCELED"
          ? "Cancelado"
          : "Expirado"}
      </span>
    );
  };

  if (loading || status === "loading") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#0D0D0D]">Minha Conta</h1>
        <p className="text-gray-500">Gerencie suas informações e acompanhe seus pedidos.</p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-8 w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="orders" className="gap-2">
            <Package className="w-4 h-4" />
            Meus Pedidos
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Dados Pessoais
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {orders.length === 0 ? (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
                <p className="text-gray-500 mb-6">Você ainda não realizou nenhuma compra conosco.</p>
                <Button asChild variant="default">
                  <a href="/products">Ir às compras</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden border hover:border-primary/30 transition-colors">
                <div className="bg-gray-50/50 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Pedido #{order.id.toString().padStart(4, "0")}
                    </span>
                    <div className="flex items-center text-sm text-gray-600 gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="font-medium text-gray-900">{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    {order.status === "PENDING" && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/checkout/${order.id}`}>Pagar Agora</a>
                      </Button>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md shrink-0 overflow-hidden relative">
                          <img
                            src={item.product.imageUrl || "https://placehold.co/100x100?text=Prod"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.quantity}x {formatCurrency(item.price)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* --- ABA DE PERFIL --- */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Seus dados de cadastro.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                    <div className="p-3 bg-gray-50 border rounded-md text-gray-900">{user.name}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">E-mail</label>
                    <div className="p-3 bg-gray-50 border rounded-md text-gray-900">{user.email}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Membro desde</label>
                    <div className="p-3 bg-gray-50 border rounded-md text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
