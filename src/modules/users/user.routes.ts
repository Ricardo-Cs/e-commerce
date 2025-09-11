import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.post("/", (req, res, next) => userController.create(req, res));

export default router;