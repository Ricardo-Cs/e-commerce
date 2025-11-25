import { Router } from "express";
import categoryRouter from "./modules/categories/category.routes";
import productRouter from "./modules/products/product.routes";
import userRouter from "./modules/users/user.routes";
import cartRouter from "./modules/carts/cart.routes";
import authRouter from "./modules/auth/auth.routes";
import paymentRouter from "./modules/payments/payment.routes";
import swaggerRouter from "./config/swagger";
import orderRouter from "./modules/orders/order.routes";

const router = Router();

router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/payments", paymentRouter);
router.use("/orders", orderRouter);
router.use("/users", userRouter);
router.use("/carts", cartRouter);
router.use("/auth", authRouter);
router.use("/", swaggerRouter);

export default router;