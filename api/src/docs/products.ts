export const productPaths = {
    "/products": {
        get: {
            summary: "Lista todos os produtos",
            tags: ["Products"],
            responses: {
                "200": { description: "Lista de produtos" }
            }
        },
        post: {
            summary: "Cria um novo produto",
            tags: ["Products"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Product" }
                    }
                }
            },
            responses: { "201": { description: "Produto criado" } }
        }
    },
    "/products/{id}": {
        get: {
            summary: "Retorna um produto pelo ID",
            tags: ["Products"],
            parameters: [
                { in: "path", name: "id", required: true, schema: { type: "integer" } }
            ],
            responses: { "200": { description: "Produto encontrado" }, "404": { description: "Produto não encontrado" } }
        },
        put: {
            summary: "Atualiza um produto",
            tags: ["Products"],
            parameters: [
                { in: "path", name: "id", required: true, schema: { type: "integer" } }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": { schema: { $ref: "#/components/schemas/Product" } }
                }
            },
            responses: { "200": { description: "Produto atualizado" }, "404": { description: "Produto não encontrado" } }
        },
        delete: {
            summary: "Deleta um produto",
            tags: ["Products"],
            parameters: [
                { in: "path", name: "id", required: true, schema: { type: "integer" } }
            ],
            responses: { "204": { description: "Produto deletado" }, "404": { description: "Produto não encontrado" } }
        }
    }
};
