import { AppError } from "../../errors/AppError";
import { UserRepository } from "../users/user.repository";
import { loginAuthSchema, registerAuthSchema } from "./auth.schema";

const userRepo = new UserRepository()

export class AuthService {
    async login(input: unknown) {
        const data = loginAuthSchema.parse(input);
        const user = await userRepo.findByEmail(data.email);

        if (!user || user.password != data.password) throw new AppError("Email ou senha incorretos", 401);

        return {
            login: true,
            id: user.id as number,
            isAdmin: user.isAdmin
        };
    }

    async register(input: unknown) {
        const data = registerAuthSchema.parse(input);

        const userExists = await userRepo.findByEmail(data.email);
        if (userExists) throw new AppError("Email já cadastrado", 400);

        const user = await userRepo.create(data);

        return {
            success: true,
            message: "Usuário registrado com sucesso",
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
}