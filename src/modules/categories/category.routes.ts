import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authMiddleware } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/isAdmin";

const router = Router();
const categoryController = new CategoryController();

router.get('/', authMiddleware, (req, res) => categoryController.getAll(req, res));

// Rotas de admin
router.post('/', authMiddleware, isAdmin, (req, res) => categoryController.create(req, res));
router.put('/:id', authMiddleware, isAdmin, (req, res) => categoryController.update(req, res));
router.delete('/:id', authMiddleware, isAdmin, (req, res) => categoryController.delete(req, res));
export default router;