"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { api } from "@/lib/api/client"

export default function TestButton() {
  const handleClick = async () => {
    try {
      const data = await api.get("/products")

      toast.success("Sucesso!", {
        description: data.message || "API respondeu com sucesso 🚀",
      })
      console.log(data.products);
    } catch (err: any) {
      toast.error("Erro", {
        description: err.message || "Falha na requisição",
      })
    }
  }

  return <Button onClick={handleClick}>Testar API</Button>
}
