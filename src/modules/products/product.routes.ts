import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const productController = new ProductController();

// Rotas públicas
router.get("/", (req, res) => productController.getAll(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));

// Rotas de admin (ex.: proteger com middleware de auth/admin)
router.post("/", authMiddleware, (req, res) => productController.create(req, res));
router.put("/:id", authMiddleware, (req, res) => productController.update(req, res));
router.delete("/:id", authMiddleware, (req, res) => productController.delete(req, res));

export default router;