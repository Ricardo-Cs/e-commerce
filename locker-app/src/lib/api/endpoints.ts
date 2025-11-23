import { api } from "./client"

export const usersApi = {
    list: () => api.get("/users"),
    create: (data: any) => api.post("/users", data),
}

export const categoriesApi = {
    list: () => api.get("/categories"),
    create: (data: { name: string }) => api.post("/categories", data),
}

export const productsApi = {
    list: (page: number = 1, limit: number = 9) => api.get(`/products?page=${page}&limit=${limit}`), // Adicionado list com paginação
    get: (id: string) => api.get(`/products/${id}`),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    updateCategories: (id: string, categoryIds: number[]) => api.post(`/products/${id}/categories`, { categoryIds }),
}