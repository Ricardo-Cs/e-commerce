export const authPaths = {
    "/auth/login": {
        post: {
            summary: "Faz login no sistema",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/Auth" }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Token JWT",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    token: {
                                        type: "string",
                                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    }
                                },
                                required: ["token"]
                            }
                        }
                    }
                }
            }

        }
    }
};
