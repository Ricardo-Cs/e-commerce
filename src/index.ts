import express from 'express';
import cors from 'cors';
import router from './routes';
import swaggerRouter from './config/swagger'

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use("/api", swaggerRouter);

app.listen(3000, () => { console.log("Rodando na porta 3000") });