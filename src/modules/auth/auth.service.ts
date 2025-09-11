import { UserRepository } from "../users/user.repository";
import { loginAuthSchema } from "./auth.schema";

const repo = new UserRepository()

export class AuthService {
    async login(input: unknown) {
        const data = loginAuthSchema.parse(input);
        const user = await repo.findByEmail(data.email);

        if (!user || user.password != data.password) throw new Error("Email ou senha incorretos!");
        return true;
    }
}