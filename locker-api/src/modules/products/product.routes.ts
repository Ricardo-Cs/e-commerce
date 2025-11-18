import { Router } from "express";
import { ProductController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/isAdmin";
import multer from "multer";

const router = Router();
const productController = new ProductController();
const upload = multer({ dest: "uploads/" })

// Rotas públicas
router.get("/", (req, res) => productController.listWithPagination(req, res));
router.get("/:id", (req, res) => productController.getById(req, res));

// Rotas de admin
router.post("/", authMiddleware, isAdmin, (req, res) => productController.create(req, res));
router.post("/many", authMiddleware, isAdmin, (req, res) => productController.createMany(req, res));
router.put("/:id/upload", authMiddleware, isAdmin, upload.array("images", 5), (req, res) => productController.uploadImages(req, res));
router.put("/:id", authMiddleware, isAdmin, (req, res) => productController.update(req, res));
router.delete("/:id", authMiddleware, isAdmin, (req, res) => productController.delete(req, res));

export default router;