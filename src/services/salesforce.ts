import jsforce from 'jsforce';
import { config } from '../config';
import { SFCart, SFCartItem } from '../types';

class SalesforceService {
	private conn: jsforce.Connection;
	private isConnected = false;

	constructor() {
		this.conn = new jsforce.Connection({
			loginUrl: config.salesforce.loginUrl,
		});
	}

	async connect(): Promise<void> {
		if (this.isConnected) return;

		await this.conn.login(
			config.salesforce.username,
			config.salesforce.password + config.salesforce.securityToken
		);
		this.isConnected = true;
		console.log('✓ Connected to Salesforce');
	}

	async getCart(cartId: string): Promise<SFCart> {
		await this.connect();
		const result = await this.conn.sobject('Cart').retrieve(cartId);
		return result as SFCart;
	}

	async getCartItems(cartId: string): Promise<SFCartItem[]> {
		await this.connect();
		const result = await this.conn.sobject('CartItem').find({ CartId: cartId });
		return result as SFCartItem[];
	}

	async addCartItem(item: SFCartItem): Promise<SFCartItem> {
		await this.connect();
		const result = await this.conn.sobject('CartItem').create(item);
		return { ...item, Id: result.id };
	}

	async deleteCartItem(itemId: string): Promise<void> {
		await this.connect();
		await this.conn.sobject('CartItem').delete(itemId);
	}
}

export default new SalesforceService();