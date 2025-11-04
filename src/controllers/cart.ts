import { Request, Response } from 'express';
import salesforceService from '../services/salesforce';
import cartTransformer from '../transformers/cart';
import {addCartItemSchema} from "../validators/cart";

export class CartController {
	async getCart(req: Request, res: Response) {
		try {
			const { id: cartId } = req.params;

			const sfCart = await salesforceService.getCart(cartId);
			const sfItems = await salesforceService.getCartItems(cartId);

			const appCart = cartTransformer.toAppCart(sfCart, sfItems);

			res.json(appCart);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async addCartItem(req: Request, res: Response) {
		try {
			const userId = req.user!.userId;

			const validated = addCartItemSchema.parse(req.body);

			// Use userId as cartId (or implement your own cart lookup logic)
			const cartId = userId;

			const sfItem = cartTransformer.toSalesforceItem(validated, cartId);
			const createdItem = await salesforceService.addCartItem(sfItem);

			res.status(201).json(cartTransformer.toAppItem(createdItem));
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async deleteCartItem(req: Request, res: Response) {
		try {
			const { id: itemId } = req.params;

			await salesforceService.deleteCartItem(itemId);

			res.status(204).send();
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}

export default new CartController();