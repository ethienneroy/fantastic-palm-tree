import app from './app';
import { config } from './config';

app.listen(config.port, () => {
	console.log(`🚀 Server running on http://localhost:${config.port}`);
	console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});