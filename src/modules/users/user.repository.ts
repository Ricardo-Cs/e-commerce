import { PrismaClient } from "@prisma/client";
import type { User } from "./user.types";

export const prisma = new PrismaClient();

export class UserRepository {
    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async create(data: Omit<User, "id" | "isAdmin" | "createdAt" | "updatedAt">): Promise<User> {
        return prisma.user.create({ data });
    }
}