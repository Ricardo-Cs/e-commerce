"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("Credenciais inválidas");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      onOpenChange(false); // fecha modal
      setEmail("");
      setPassword("");
    } catch {
      setError("Erro de conexão");
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8 rounded-xl">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <div>
              <label className="text-sm">E-mail</label>
              <Input type="email" value={email} placeholder="seu@email..." onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-sm">Senha</label>
              <Input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </TabsContent>

          <TabsContent value="register">
            <p className="text-gray-600 text-sm">Implementar cadastro depois.</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
