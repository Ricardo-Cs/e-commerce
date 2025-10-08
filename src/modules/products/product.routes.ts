import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/isAdmin";

const router = Router();
const productController = new ProductController();

// Rotas públicas
// router.get("/", (req, res) => productController.getAll(req, res)); // Falta inserir os filtros/paginação
router.get("/:id", (req, res) => productController.getById(req, res));

// Rotas de admin)
router.post("/", authMiddleware, isAdmin, (req, res) => productController.create(req, res));
router.put("/:id", authMiddleware, isAdmin, (req, res) => productController.update(req, res));
router.delete("/:id", authMiddleware, isAdmin, (req, res) => productController.delete(req, res));

export default router;