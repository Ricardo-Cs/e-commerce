"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { authApi } from "@/lib/api/endpoints";

export default function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas");
      setLoading(false);
      return;
    }

    toast.success("Login realizado com sucesso!");
    onOpenChange(false);
    setEmail("");
    setPassword("");
    setLoading(false);
  }

  async function handleRegister() {
    setError("");

    if (registerName.length < 8) {
      setError("O nome precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (registerPassword.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });

      if (response) {
        toast.success("Conta criada com sucesso!", {
          description: "Faça login para continuar.",
        });

        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");

        setEmail(response.user?.email || registerEmail);
        setActiveTab("login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden asChild>
        <DialogTitle className="DialogTitle">Autenticação</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="max-w-md p-8 rounded-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>

          {/* --- LOGIN FORM --- */}
          <TabsContent value="login" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">E-mail</label>
              <Input
                type="email"
                value={email}
                placeholder="seu@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Senha</label>
              <Input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && activeTab === "login" && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <Button onClick={handleLogin} disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </TabsContent>

          {/* --- REGISTER FORM --- */}
          <TabsContent value="register" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nome Completo</label>
              <Input
                type="text"
                value={registerName}
                placeholder="Mínimo 8 caracteres"
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">E-mail</label>
              <Input
                type="email"
                value={registerEmail}
                placeholder="seu@email.com"
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Senha</label>
              <Input
                type="password"
                value={registerPassword}
                placeholder="Mínimo 8 caracteres"
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>

            {error && activeTab === "register" && <p className="text-sm text-red-500 font-medium">{error}</p>}

            <Button onClick={handleRegister} disabled={loading} className="w-full">
              {loading ? "Criando conta..." : "Cadastrar"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
