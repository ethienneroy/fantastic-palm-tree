import { z } from 'zod';

export const addCartItemSchema = z.object({
	productId: z.string().min(1, 'Product ID is required'),
	quantity: z.number().int().positive('Quantity must be positive'),
	price: z.number().positive('Price must be positive'),
});