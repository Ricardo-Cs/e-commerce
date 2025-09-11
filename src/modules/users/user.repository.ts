import { PrismaClient } from "@prisma/client";
import type { User } from "./user.types";

export const prisma = new PrismaClient();

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
        return prisma.user.create({ data });
    }
}