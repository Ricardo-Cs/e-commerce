import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      <h1 className="text-3xl font-bold">Bem-vindo à Loja</h1>

      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Produto em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Camisa básica — R$ 59,90</p>
          <Button>Comprar</Button>
        </CardContent>
      </Card>
    </main>
  )
}
