import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
      <h1 className="text-3xl font-bold text-center">Bem-vindo a Locker</h1>

      <Card className="text-center">
        <CardHeader>
          <CardTitle>Produto em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Camisa básica — R$ 59,90</p>
          <Button>Comprar</Button>
        </CardContent>
      </Card>
    </div>
  )
}
