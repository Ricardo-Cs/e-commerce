import { AppError } from "../../errors/AppError";
import { compareHash, hashPassword } from "../../libs/bcrypt/bcrypt";
import { CartRepository } from "../carts/cart.repository";
import { UserRepository } from "../users/user.repository";
import { loginAuthSchema, registerAuthSchema } from "./auth.schema";

const userRepo = new UserRepository();
const cartRepo = new CartRepository();

export class AuthService {
    async login(input: unknown) {
        const data = loginAuthSchema.parse(input);
        const user = await userRepo.findByEmail(data.email);

        if (!user || !(await compareHash(data.password, user.password))) throw new AppError("Email ou senha incorretos", 401);

        return {
            login: true,
            id: user.id as number,
            isAdmin: user.isAdmin,
            name: user.name
        };
    }

    async register(input: unknown) {
        const data = registerAuthSchema.parse(input);

        if (await userRepo.findByEmail(data.email)) {
            throw new AppError("Email já cadastrado", 400);
        }

        try {
            data.password = await hashPassword(data.password);
        } catch (err) {
            throw new AppError("Erro ao processar senha", 500);
        }

        const user = await userRepo.create(data);
        const cart = await cartRepo.create(user.id as number);

        return {
            message: "Usuário registrado com sucesso",
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
}