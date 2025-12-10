"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminProductsTab } from "@/components/admin/AdminProductsTab";
import { AdminOrdersTab } from "@/components/admin/AdminOrdersTab";
import { AdminOverviewTab } from "@/components/admin/AdminOverviewTab";
import { Package, ShoppingBag, LayoutDashboard, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview"); // <-- Mude o padrão para overview

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0D0D0D]" />
      </div>
    );
  }

  if (session?.user?.role !== "admin") return null;

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-[#0D0D0D]">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-[#0D0D0D]">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Gerencie sua loja, produtos e pedidos.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium">Admin: {session.user.name}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 w-full md:w-auto grid grid-cols-3 md:inline-flex bg-white border border-gray-200 p-1 rounded-lg h-auto">
            {/* Nova Aba de Overview */}
            <TabsTrigger
              value="overview"
              className="gap-2 px-6 py-3 data-[state=active]:bg-[#0D0D0D] data-[state=active]:text-white transition-all rounded-md"
            >
              <LayoutDashboard className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>

            <TabsTrigger
              value="products"
              className="gap-2 px-6 py-3 data-[state=active]:bg-[#0D0D0D] data-[state=active]:text-white transition-all rounded-md"
            >
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="gap-2 px-6 py-3 data-[state=active]:bg-[#0D0D0D] data-[state=active]:text-white transition-all rounded-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AdminOverviewTab />
          </TabsContent>

          <TabsContent value="products" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AdminProductsTab />
          </TabsContent>

          <TabsContent value="orders" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <AdminOrdersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
