import { UserRepository } from "./user.repository";
import { createUserSchema } from "./user.schema";

const repo = new UserRepository();

export class UserService {
    async create(input: unknown) {
        const data = createUserSchema.parse(input);
        return repo.create(data);
    }
}