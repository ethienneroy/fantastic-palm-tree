import cartTransformer from '../transformers/cart';


describe('CartTransformer', () => {
	describe('toSalesforceItem', () => {
		it('should transform app cart item to Salesforce format', () => {
			const appItem = {
				productId: 'prod-123',
				quantity: 2,
				price: 29.99,
			};

			const result = cartTransformer.toSalesforceItem(appItem, 'cart-456');

			expect(result).toEqual({
				Product2Id: 'prod-123',
				CartId: 'cart-456',
				Quantity: 2,
				UnitPrice: 29.99,
			});
		});

		it('should handle item with all optional fields', () => {
			const appItem = {
				id: 'item-789',
				productId: 'prod-123',
				productName: 'Test Product',
				quantity: 5,
				price: 99.99,
			};

			const result = cartTransformer.toSalesforceItem(appItem, 'cart-456');

			expect(result).toEqual({
				Product2Id: 'prod-123',
				CartId: 'cart-456',
				Quantity: 5,
				UnitPrice: 99.99,
			});
			// Optional fields should not be included in SF format
			expect(result).not.toHaveProperty('id');
			expect(result).not.toHaveProperty('productName');
		});

		it('should handle decimal quantities and prices', () => {
			const appItem = {
				productId: 'prod-decimal',
				quantity: 1,
				price: 19.95,
			};

			const result = cartTransformer.toSalesforceItem(appItem, 'cart-999');

			expect(result.UnitPrice).toBe(19.95);
			expect(result.Quantity).toBe(1);
		});
	});

	describe('toAppItem', () => {
		it('should transform Salesforce cart item to app format', () => {
			const sfItem = {
				Id: 'sf-item-123',
				Product2Id: 'prod-456',
				CartId: 'cart-789',
				Quantity: 3,
				UnitPrice: 49.99,
			};

			const result = cartTransformer.toAppItem(sfItem);

			expect(result).toEqual({
				id: 'sf-item-123',
				productId: 'prod-456',
				quantity: 3,
				price: 49.99,
			});
		});

		it('should handle item without Id', () => {
			const sfItem = {
				Product2Id: 'prod-456',
				CartId: 'cart-789',
				Quantity: 1,
				UnitPrice: 9.99,
			};

			const result = cartTransformer.toAppItem(sfItem);

			expect(result).toEqual({
				id: undefined,
				productId: 'prod-456',
				quantity: 1,
				price: 9.99,
			});
		});

		it('should not include CartId in app format', () => {
			const sfItem = {
				Id: 'sf-item-123',
				Product2Id: 'prod-456',
				CartId: 'cart-789',
				Quantity: 2,
				UnitPrice: 25.00,
			};

			const result = cartTransformer.toAppItem(sfItem);

			expect(result).not.toHaveProperty('CartId');
			expect(result).not.toHaveProperty('cartId');
		});
	});

	describe('toAppCart', () => {
		it('should transform Salesforce cart with items to app format', () => {
			const sfCart = {
				Id: 'cart-123',
				OwnerId: 'user-456',
				TotalAmount: 129.97,
			};

			const sfItems = [
				{
					Id: 'item-1',
					Product2Id: 'prod-1',
					CartId: 'cart-123',
					Quantity: 2,
					UnitPrice: 29.99,
				},
				{
					Id: 'item-2',
					Product2Id: 'prod-2',
					CartId: 'cart-123',
					Quantity: 1,
					UnitPrice: 69.99,
				},
			];

			const result = cartTransformer.toAppCart(sfCart, sfItems);

			expect(result).toEqual({
				id: 'cart-123',
				userId: 'user-456',
				items: [
					{
						id: 'item-1',
						productId: 'prod-1',
						quantity: 2,
						price: 29.99,
					},
					{
						id: 'item-2',
						productId: 'prod-2',
						quantity: 1,
						price: 69.99,
					},
				],
				total: 129.97,
				itemCount: 2,
			});
		});

		it('should calculate total correctly', () => {
			const sfCart = {
				Id: 'cart-123',
				OwnerId: 'user-456',
			};

			const sfItems = [
				{
					Id: 'item-1',
					Product2Id: 'prod-1',
					CartId: 'cart-123',
					Quantity: 3,
					UnitPrice: 10.00,
				},
				{
					Id: 'item-2',
					Product2Id: 'prod-2',
					CartId: 'cart-123',
					Quantity: 2,
					UnitPrice: 25.50,
				},
			];

			const result = cartTransformer.toAppCart(sfCart, sfItems);

			// 3 * 10.00 + 2 * 25.50 = 30.00 + 51.00 = 81.00
			expect(result.total).toBe(81.00);
			expect(result.itemCount).toBe(2);
		});

		it('should handle empty cart', () => {
			const sfCart = {
				Id: 'cart-empty',
				OwnerId: 'user-123',
			};

			const sfItems = [];

			const result = cartTransformer.toAppCart(sfCart, sfItems);

			expect(result).toEqual({
				id: 'cart-empty',
				userId: 'user-123',
				items: [],
				total: 0,
				itemCount: 0,
			});
		});

		it('should handle cart with single item', () => {
			const sfCart = {
				Id: 'cart-single',
				OwnerId: 'user-999',
			};

			const sfItems = [
				{
					Id: 'item-only',
					Product2Id: 'prod-only',
					CartId: 'cart-single',
					Quantity: 1,
					UnitPrice: 99.99,
				},
			];

			const result = cartTransformer.toAppCart(sfCart, sfItems);

			expect(result.total).toBe(99.99);
			expect(result.itemCount).toBe(1);
			expect(result.items).toHaveLength(1);
		});

		it('should handle decimal prices correctly', () => {
			const sfCart = {
				Id: 'cart-decimal',
				OwnerId: 'user-123',
			};

			const sfItems = [
				{
					Id: 'item-1',
					Product2Id: 'prod-1',
					CartId: 'cart-decimal',
					Quantity: 3,
					UnitPrice: 9.99,
				},
			];

			const result = cartTransformer.toAppCart(sfCart, sfItems);

			// 3 * 9.99 = 29.97
			expect(result.total).toBeCloseTo(29.97, 2);
		});

		it('should ignore SF TotalAmount and calculate from items', () => {
			const sfCart = {
				Id: 'cart-123',
				OwnerId: 'user-456',
				TotalAmount: 999.99, // Wrong total in SF
			};

			const sfItems = [
				{
					Id: 'item-1',
					Product2Id: 'prod-1',
					CartId: 'cart-123',
					Quantity: 1,
					UnitPrice: 10.00,
				},
			];

			const result = cartTransformer.toAppCart(sfCart, sfItems);

			// Should calculate from items, not use TotalAmount
			expect(result.total).toBe(10.00);
			expect(result.total).not.toBe(999.99);
		});
	});

	describe('bidirectional transformation', () => {
		it('should maintain data integrity through app -> SF -> app transformation', () => {
			const originalAppItem = {
				productId: 'prod-123',
				quantity: 5,
				price: 19.99,
			};

			// App -> SF
			const sfItem = cartTransformer.toSalesforceItem(originalAppItem, 'cart-456');

			// Simulate SF adding an ID
			const sfItemWithId = { ...sfItem, Id: 'sf-generated-id' };

			// SF -> App
			const resultAppItem = cartTransformer.toAppItem(sfItemWithId);

			expect(resultAppItem.productId).toBe(originalAppItem.productId);
			expect(resultAppItem.quantity).toBe(originalAppItem.quantity);
			expect(resultAppItem.price).toBe(originalAppItem.price);
			expect(resultAppItem.id).toBe('sf-generated-id');
		});
	});
});