import { Router } from "express";
import { UserController } from "./user.controller";
import { isAdmin } from "../../middlewares/isAdmin";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const userController = new UserController();

router.get('/', authMiddleware, isAdmin, (req, res, next) => userController.getAll(req, res))

export default router;