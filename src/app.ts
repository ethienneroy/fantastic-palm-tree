import express from 'express';
import cors from 'cors';
import cartRoutes from './routes/cart';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

// Routes
app.use('/cart', cartRoutes);

export default app;