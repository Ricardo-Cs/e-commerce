import { toast } from "sonner"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

async function request(path: string, options: RequestInit = {}) {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    }

    try {
        const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

        if (!res.ok) {
            const msg = await res.text()
            toast.error("Erro na requisição", {
                description: msg || `Status ${res.status}`,
            })
            throw new Error(msg)
        }

        return await res.json()
    } catch (err: any) {
        toast.error("Erro de conexão", {
            description: err.message || "Falha na comunicação com o servidor",
        })
        throw err
    }
}

export const api = {
    get: (url: string) => request(url),
    post: (url: string, body: any) =>
        request(url, { method: "POST", body: JSON.stringify(body) }),
    put: (url: string, body: any) =>
        request(url, { method: "PUT", body: JSON.stringify(body) }),
    del: (url: string) => request(url, { method: "DELETE" }),
}
