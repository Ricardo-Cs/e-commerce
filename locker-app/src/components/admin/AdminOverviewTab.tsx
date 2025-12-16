"use client";

import { useEffect, useState, useMemo } from "react";
import { ordersApi, productsApi } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Users,
  CreditCard,
  ShoppingBag,
  CalendarDays,
  BarChart3,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
  quantity: number;
  product: { name: string; id: number };
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  customerName: string; // Adicionado para lista recente
  items: OrderItem[];
}

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export function AdminOverviewTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    async function loadData() {
      try {
        // Carrega Pedidos e Produtos simultaneamente
        const [ordersData, productsData] = await Promise.all([
          ordersApi.listAllOrders(),
          productsApi.list({ limit: 100 }), // Traz um limite alto para analise
        ]);
        setOrders(ordersData);
        setProducts(productsData.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - parseInt(timeRange));

    const filteredOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= cutoffDate;
    });

    const paidOrders = filteredOrders.filter((o) => o.status === "APPROVED");

    // 1. KPIs Financeiros
    const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = paidOrders.length;
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    // 2. Alertas de Estoque (Menos de 5 unidades)
    const lowStockProducts = products
      .filter((p) => p.stock < 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5); // Top 5 críticos

    // 3. Top Produtos Vendidos
    const productMap: Record<string, number> = {};
    paidOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const name = item.product.name;
        productMap[name] = (productMap[name] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productMap)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // 4. Gráfico de Barras (Dias)
    const daysMap = [0, 0, 0, 0, 0, 0, 0];
    paidOrders.forEach((order) => {
      const day = new Date(order.createdAt).getDay();
      daysMap[day]++;
    });
    const maxSalesInDay = Math.max(...daysMap, 1);
    const daysData = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((label, index) => ({
      label,
      value: daysMap[index],
      height: Math.round((daysMap[index] / maxSalesInDay) * 100),
    }));

    // 5. Últimos Pedidos (Recentes)
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalRevenue,
      totalSales,
      averageTicket,
      topProducts,
      daysData,
      lowStockProducts,
      recentOrders,
      count: filteredOrders.length,
    };
  }, [orders, products, timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header com Filtro */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-xl font-serif font-semibold">Dashboard Executivo</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Análise de:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Este Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Receita Aprovada</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">No período selecionado</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Volume de Vendas</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground mt-1">Pedidos pagos / {stats.count} totais</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{formatCurrency(stats.averageTicket)}</div>
            <p className="text-xs text-muted-foreground mt-1">Média por cliente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Coluna Principal (Esquerda) */}
        <div className="col-span-4 space-y-6">
          {/* Gráfico de Barras */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" /> Performance Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-[180px] w-full pt-4 gap-3">
                {stats.daysData.map((day) => (
                  <div key={day.label} className="flex flex-col items-center justify-end w-full h-full gap-2 group">
                    <div
                      className="w-full bg-gray-900 rounded-sm transition-all duration-500 group-hover:bg-primary relative"
                      style={{ height: `${day.height > 0 ? day.height : 2}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.value} vendas
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium uppercase">{day.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Últimos Pedidos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Pedidos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">
                        #{order.id} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(order.total)}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          order.status === "APPROVED"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : order.status === "PENDING"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : ""
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral (Direita) */}
        <div className="col-span-3 space-y-6">
          {/* Alertas de Estoque */}
          <Card className="border-red-100 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Atenção: Estoque Baixo
              </CardTitle>
              <CardDescription className="text-red-600/80">Produtos com menos de 5 unidades.</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.lowStockProducts.length === 0 ? (
                <div className="text-sm text-gray-500 py-4 text-center">Estoque saudável.</div>
              ) : (
                <div className="space-y-3">
                  {stats.lowStockProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between bg-white p-3 rounded-md border border-red-100 shadow-sm"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">{prod.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-red-600 font-bold bg-red-100 px-2 py-1 rounded">
                          {prod.stock} un
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-gray-400 cursor-pointer hover:text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-500" /> Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {stats.topProducts.map((prod, i) => (
                  <div key={prod.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{prod.name}</span>
                        <span className="text-xs font-bold text-gray-900">{prod.quantity}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${(prod.quantity / stats.topProducts[0].quantity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {stats.topProducts.length === 0 && <p className="text-sm text-gray-400 text-center">Nenhum dado.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
