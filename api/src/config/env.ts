import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(20),
    PORT: z.string().default("3000"),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
})

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const errorTree = z.treeifyError(parsed.error);

    console.error("Erro nas variáveis de ambiente:", errorTree);

    process.exit(1);
}

export const env = parsed.data;