import { Router } from "express";
import { CartController } from "./cart.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const cartController = new CartController();

router.get("/:id", authMiddleware, (req, res) => cartController.getUserCart(req, res));
router.post("/", authMiddleware, (req, res) => cartController.insertProductInCart(req, res));

export default router;