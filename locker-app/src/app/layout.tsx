// src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "../components/auth/AuthProvider";
import { CartProvider } from "../context/CartContext";

export const metadata: Metadata = {
  title: "Locker",
  description: "Loja Online de Roupas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-background" suppressHydrationWarning={true}>
        <AuthProvider>
          <CartProvider>
            <div className="mx-auto w-full sticky top-0 z-50 bg-white backdrop-blur-sm shadow-sm">
              <Header />
            </div>

            <main className="flex-1 mx-auto w-full px-3 sm:px-0">{children}</main>

            <Toaster richColors closeButton position="top-right" />
            <div className="container mx-auto w-full px-6 py-8">
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
