import { api } from "./client"

interface ListParams {
    page?: number
    limit?: number
    categories?: number[]
    maxPrice?: number
}

export const usersApi = {
    list: () => api.get("/users"),
    create: (data: any) => api.post("/users", data),
}

export const categoriesApi = {
    list: () => api.get("/categories"),
    create: (data: { name: string }) => api.post("/categories", data),
}

export const productsApi = {
    list: async ({ page, limit, categories, maxPrice }: ListParams) => {
        const params = new URLSearchParams()

        if (page) params.append("page", String(page))
        if (limit) params.append("limit", String(limit))

        if (categories?.length)
            params.append("categories", categories.join(","))

        if (maxPrice)
            params.append("maxPrice", String(maxPrice))

        return api.get(`/products?${params.toString()}`)
    },

    get: (id: string) => api.get(`/products/${id}`),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    updateCategories: (id: string, categoryIds: number[]) =>
        api.post(`/products/${id}/categories`, { categoryIds }),
}