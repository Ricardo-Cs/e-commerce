import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string().min(20),
    PORT: z.string().default("3000")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Erro nas variáveis de ambiente:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
