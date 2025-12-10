"use client";

import { useEffect, useState, useMemo } from "react";
import { ordersApi } from "@/lib/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Users, CreditCard, ShoppingBag, CalendarDays, BarChart3, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Tipagem baseada no retorno atualizado da API
interface OrderItem {
  quantity: number;
  product: { name: string };
}

interface Order {
  id: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export function AdminOverviewTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // Dias: 7, 30, 90, 365

  useEffect(() => {
    async function loadData() {
      try {
        const data = await ordersApi.listAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- LÓGICA DE PROCESSAMENTO DE DADOS ---
  const stats = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - parseInt(timeRange));

    // 1. Filtrar pedidos pelo período e status (apenas pagos contam para receita real)
    const filteredOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= cutoffDate;
    });

    const paidOrders = filteredOrders.filter((o) => o.status === "APPROVED");

    // 2. Métricas Gerais
    const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = paidOrders.length;
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    // 3. Produtos Mais Vendidos
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
      .slice(0, 5); // Top 5

    // 4. Vendas por Dia da Semana
    const daysMap = [0, 0, 0, 0, 0, 0, 0]; // Dom a Sab
    paidOrders.forEach((order) => {
      const day = new Date(order.createdAt).getDay();
      daysMap[day]++;
    });

    // Normalizar para gráfico (encontrar o maior valor para calcular altura da barra)
    const maxSalesInDay = Math.max(...daysMap, 1);
    const daysData = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((label, index) => ({
      label,
      value: daysMap[index],
      height: Math.round((daysMap[index] / maxSalesInDay) * 100),
    }));

    return {
      totalRevenue,
      totalSales,
      averageTicket,
      topProducts,
      daysData,
      count: filteredOrders.length,
    };
  }, [orders, timeRange]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Filtro de Período */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-semibold">Visão Geral</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Período:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Este Trimestre</SelectItem>
              <SelectItem value="365">Este Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Vendas aprovadas no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pagos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
            <p className="text-xs text-muted-foreground">Taxa de conversão sobre {stats.count} pedidos totais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageTicket)}</div>
            <p className="text-xs text-muted-foreground">Média de valor por venda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Gráfico de Barras: Vendas por Dia da Semana */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              Picos de Vendas
            </CardTitle>
            <CardDescription>Volume de vendas aprovadas por dia da semana.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex items-end justify-between h-[200px] w-full px-4 pt-4 gap-2">
              {stats.daysData.map((day) => (
                <div key={day.label} className="flex flex-col items-center justify-end w-full h-full gap-2 group">
                  <div
                    className="w-full bg-[#0D0D0D] rounded-t-sm transition-all duration-500 group-hover:opacity-80 relative"
                    style={{ height: `${day.height > 0 ? day.height : 2}%` }} // Minimo 2% para visual
                  >
                    {/* Tooltip simples com o valor exato */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {day.value} vendas
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{day.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lista: Produtos Mais Vendidos */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-500" />
              Top Produtos
            </CardTitle>
            <CardDescription>As peças mais populares no período selecionado.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Sem dados de vendas.</p>
              ) : (
                stats.topProducts.map((prod, i) => (
                  <div key={prod.name} className="flex items-center">
                    <div className="w-8 text-sm font-bold text-gray-400">0{i + 1}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">{prod.name}</p>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(prod.quantity / stats.topProducts[0].quantity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-sm font-bold text-[#0D0D0D]">
                      {prod.quantity} <span className="text-[10px] font-normal text-gray-500">und</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
