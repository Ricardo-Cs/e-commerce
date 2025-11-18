import type { JwtPayload } from "../../config/jwt";
import { AppError } from "../../errors/AppError";
import { UserRepository } from "./user.repository";
import { createUserSchema, updateUserSchema } from "./user.schema";

const repo = new UserRepository();

export class UserService {
    async create(input: unknown) {
        const data = createUserSchema.parse(input);
        return await repo.create(data);
    }

    async getOne(input: JwtPayload) {
        const user = await repo.findById(input.id);
        if (input.isAdmin) return user;
        else return { name: user?.name, email: user?.email, password: user?.password };
    }

    async getOneById(id: number) {
        const user = await repo.findById(id);
        if (!user) throw new AppError("Usuário não existe", 400);
        return user;
    }

    async getAll() {
        return await repo.findAll();
    }

    async update(input: JwtPayload, data: unknown) {
        const user = updateUserSchema.parse(data);
        return await repo.update(input.id, user);
    }
}