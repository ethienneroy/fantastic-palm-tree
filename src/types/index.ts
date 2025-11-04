export interface AppCartItem {
	id?: string;
	productId: string;
	productName?: string;
	quantity: number;
	price: number;
}

export interface AppCart {
	id: string;
	userId: string;
	items: AppCartItem[];
	total: number;
	itemCount: number;
}

export interface JWTPayload {
	userId: string;
	email: string;
}

export interface SFCartItem {
	Id?: string;
	Product2Id: string;
	CartId: string;
	Quantity: number;
	UnitPrice: number;
}

export interface SFCart {
	Id: string;
	OwnerId: string;
	TotalAmount?: number;
}