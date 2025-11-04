import { AppCart, AppCartItem, SFCart, SFCartItem } from '../types';

export class CartTransformer {
	toSalesforceItem(appItem: AppCartItem, cartId: string): SFCartItem {
		return {
			Product2Id: appItem.productId,
			CartId: cartId,
			Quantity: appItem.quantity,
			UnitPrice: appItem.price,
		};
	}

	toAppItem(sfItem: SFCartItem): AppCartItem {
		return {
			id: sfItem.Id,
			productId: sfItem.Product2Id,
			quantity: sfItem.Quantity,
			price: sfItem.UnitPrice,
		};
	}

	toAppCart(sfCart: SFCart, items: SFCartItem[]): AppCart {
		const appItems = items.map(item => this.toAppItem(item));
		const total = appItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

		return {
			id: sfCart.Id,
			userId: sfCart.OwnerId,
			items: appItems,
			total,
			itemCount: appItems.length,
		};
	}
}

export default new CartTransformer();