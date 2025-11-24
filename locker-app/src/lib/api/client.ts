// src/lib/api/client.ts
"use client"

import { toast } from "sonner"
import { getSession } from "next-auth/react"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

async function request(path: string, options: RequestInit = {}) {
    let token = null;
    if (typeof window !== "undefined") {
        const session = await getSession();
        token = session?.user?.accessToken;
    }

    let body = options.body;

    const defaultHeaders: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {}),
    };

    let headers = { ...defaultHeaders };

    if (options.body && !(options.body instanceof FormData)) {
        if (!headers['Content-Type'] && !headers['content-type']) {
            headers['Content-Type'] = 'application/json';
        }

        if (typeof options.body !== 'string') {
            body = JSON.stringify(options.body);
        }
    }

    try {
        const res = await fetch(`${BASE_URL}${path}`, { ...options, headers: headers as HeadersInit, body })

        if (!res.ok) {
            let msg = ""
            try {
                msg = await res.text()
            } catch {
                msg = `Erro ${res.status}`
            }

            toast.error("Erro na requisição", {
                description: msg || `Status ${res.status}`,
            })
            throw new Error(msg)
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await res.json();
        }

        return null;
    } catch (err: any) {
        if (err.message !== "Failed to fetch" || typeof window !== 'undefined') {
            toast.error("Erro de conexão", {
                description: err.message || "Falha na comunicação com o servidor",
            })
        }
        throw err
    }
}

export const api = {
    get: (url: string) => request(url),
    post: (url: string, body: any) =>
        request(url, { method: "POST", body }),
    put: (url: string, body: any) =>
        request(url, { method: "PUT", body }),
    del: (url: string) => request(url, { method: "DELETE" }),
}