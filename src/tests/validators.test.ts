import { addCartItemSchema } from '../validators/cart';
import { z } from 'zod';

describe('addCartItemSchema', () => {
	it('should validate correct cart item data', () => {
		const validData = {
			productId: 'prod-123',
			quantity: 2,
			price: 29.99,
		};

		const result = addCartItemSchema.parse(validData);

		expect(result).toEqual(validData);
	});

	it('should reject empty productId', () => {
		const invalidData = {
			productId: '',
			quantity: 1,
			price: 10.00,
		};

		expect(() => addCartItemSchema.parse(invalidData)).toThrow(z.ZodError);
	});

	it('should reject zero quantity', () => {
		const invalidData = {
			productId: 'prod-123',
			quantity: 0,
			price: 10.00,
		};

		expect(() => addCartItemSchema.parse(invalidData)).toThrow(z.ZodError);
	});

	it('should reject negative quantity', () => {
		const invalidData = {
			productId: 'prod-123',
			quantity: -5,
			price: 10.00,
		};

		expect(() => addCartItemSchema.parse(invalidData)).toThrow(z.ZodError);
	});

	it('should reject zero price', () => {
		const invalidData = {
			productId: 'prod-123',
			quantity: 1,
			price: 0,
		};

		expect(() => addCartItemSchema.parse(invalidData)).toThrow(z.ZodError);
	});

	it('should reject negative price', () => {
		const invalidData = {
			productId: 'prod-123',
			quantity: 1,
			price: -10.00,
		};

		expect(() => addCartItemSchema.parse(invalidData)).toThrow(z.ZodError);
	});
});