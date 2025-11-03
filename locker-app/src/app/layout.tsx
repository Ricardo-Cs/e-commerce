import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";

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
      <body className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center p-3">
          {children}
        </main>
        <Toaster richColors closeButton position="top-right" />
        <Footer />
      </body>
    </html>
  );
}
