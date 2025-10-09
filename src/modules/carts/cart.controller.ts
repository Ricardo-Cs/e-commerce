import type { Request, Response } from "express";
import { CartService } from "./cart.service";

const service = new CartService();

export class CartController {
    async getUserCart(req: Request, res: Response) {
        const userId = Number(req.params.id);
        const cart = await service.getUserCart(userId);
        res.json(cart);
    }

    async insertProductInCart(req: Request, res: Response) {
        const user_id = (req as any).user.id;
        const insertedProduct = await service.insertItem(user_id, req.body);
        res.json({ message: "Produto Adicionado ao Carrinho" });
    }
}