import express from 'express';
import cors from 'cors';
import swaggerRouter from './config/swagger'
import categoryRouter from './modules/categories/category.routes';
import productRouter from './modules/products/product.routes';
import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/users/user.routes';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", swaggerRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: "Rota inexistente" });
});

app.use(errorHandler);

app.listen(env.PORT, () => { console.log("Rodando na porta 3000") });