import type { User } from "@prisma/client";
import { prisma } from "../config/prisma";
import type { CreateUserDTO } from "../dtos/user.dtos";

export class UserRepository {
    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    async create(data: CreateUserDTO): Promise<User> {
        return prisma.user.create({ data });
    }
}