import { Router } from "express";
import { UserController } from "./user.controller";
import { isAdmin } from "../../middlewares/isAdmin";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();
const userController = new UserController();

router.get('/me', authMiddleware, (req, res) => userController.getOne(req, res));
router.put('/me', authMiddleware, (req, res) => userController.update(req, res));
router.post('/create', (req, res) => userController.create(req, res));

// Rotas admin
router.get('/', authMiddleware, isAdmin, (req, res) => userController.getAll(req, res))
router.get('/:id', authMiddleware, isAdmin, (req, res) => userController.getOneById(req, res));
export default router;