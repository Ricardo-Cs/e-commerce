import { Router } from "express";
import { ProductController } from "./modules/products/product.controller";

const router = Router();
const productController = new ProductController();

// Rotas públicas
router.get("/products", (req, res) => productController.getAll(req, res));
router.get("/products/:id", (req, res) => productController.getById(req, res));

// Rotas de admin (ex.: proteger com middleware de auth/admin)
router.post("/products", (req, res) => productController.create(req, res));
router.put("/products/:id", (req, res) => productController.update(req, res));
router.delete("/products/:id", (req, res) => productController.delete(req, res));

export default router;