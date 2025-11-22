import express from 'express';
import cors from 'cors';
import { env } from "./config/env";
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", routes);

app.use((_req, res) => {
    res.status(404).json({ error: "Rota inexistente" });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Rodando na porta ${env.PORT}`);
});