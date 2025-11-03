import { api } from "./client"

export const usersApi = {
    list: () => api.get("/users"),
    create: (data: any) => api.post("/users", data),
}
