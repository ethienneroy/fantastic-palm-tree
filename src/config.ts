import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: parseInt(process.env.PORT || '3000', 10),
	jwtSecret: process.env.JWT_SECRET || 'default-secret',
	cacheTTL: parseInt(process.env.CACHE_TTL || '300', 10),
	salesforce: {
		loginUrl: process.env.SF_LOGIN_URL || 'https://login.salesforce.com',
		username: process.env.SF_USERNAME || '',
		password: process.env.SF_PASSWORD || '',
		securityToken: process.env.SF_SECURITY_TOKEN || '',
	},
};