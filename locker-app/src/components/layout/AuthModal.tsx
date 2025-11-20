"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apple, Chrome } from "lucide-react"; // Ícones sugeridos

export function AuthModal() {
  return (
    <Dialog>
      {/* O Trigger é o botão que abre o modal */}
      <DialogTrigger asChild>
        <Button variant="outline">Entrar / Cadastrar</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white rounded-xl p-0 overflow-hidden gap-0">
        {/* Cabeçalho Oculto para Acessibilidade (Screen Readers) */}
        <DialogHeader className="sr-only">
          <DialogTitle>Autenticação</DialogTitle>
          <DialogDescription>Faça login ou crie sua conta.</DialogDescription>
        </DialogHeader>

        <div className="px-8 py-10">
          <Tabs defaultValue="login" className="w-full">
            {/* Abas de Navegação */}
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-transparent p-0 border-b h-auto rounded-none">
              <TabsTrigger
                value="login"
                className="pb-3 text-lg font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent text-gray-400 hover:text-gray-600 transition-all bg-transparent"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="pb-3 text-lg font-medium data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent text-gray-400 hover:text-gray-600 transition-all bg-transparent"
              >
                Criar Conta
              </TabsTrigger>
            </TabsList>

            {/* Conteúdo: Login */}
            <TabsContent value="login" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
              <div className="space-y-1">
                <Label htmlFor="login-email">E-mail</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-gray-50 border-gray-200 py-6"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor="login-password">Senha</Label>
                  <a href="#" className="text-xs text-gray-500 hover:text-primary underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border-gray-200 py-6"
                />
              </div>
              <Button className="w-full py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Entrar
              </Button>
            </TabsContent>

            {/* Conteúdo: Cadastro */}
            <TabsContent value="register" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
              <div className="space-y-1">
                <Label htmlFor="register-name">Nome Completo</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Seu nome"
                  className="bg-gray-50 border-gray-200 py-6"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="register-email">E-mail</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-gray-50 border-gray-200 py-6"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="register-password">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border-gray-200 py-6"
                />
              </div>
              <Button className="w-full py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                Cadastrar-se
              </Button>
            </TabsContent>
          </Tabs>

          {/* Separador Social */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="py-5 hover:bg-gray-50">
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="py-5 hover:bg-gray-50">
              <Apple className="mr-2 h-4 w-4" />
              Apple
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
