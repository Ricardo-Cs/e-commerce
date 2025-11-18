export const schemas = {
    Product: {
        type: "object",
        properties: {
            id: { type: "integer" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            stock: { type: "integer" },
            imageUrl: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
        },
        required: ["name", "price", "stock"]
    },
    Auth: {
        type: "object",
        properties: {
            email: { type: "string" },
            password: { type: "string" }
        }
    }
};
