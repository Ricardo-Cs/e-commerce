import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { schemas } from "../docs/schemas";
import { productPaths } from "../docs/products";
import swaggerJsdoc from "swagger-jsdoc";
import { authPaths } from "../docs/auth";

const router = Router();

const options = {
    definition: {
        openapi: "3.0.0",
        info: { title: "API E-commerce", version: "1.0.0" },
        servers: [{ url: "http://localhost:3000/api/" }],
        components: { schemas },
        paths: { ...productPaths, ...authPaths }
    },
    apis: []
};

const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

export default router;