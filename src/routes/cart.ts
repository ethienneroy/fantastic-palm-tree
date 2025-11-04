import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/items", async (req, res) => {
	const { productId, quantity } = req.body;

	try {
		// Example call to Salesforce API (mocked or real)
		const response = await axios.post(
			"https://salesforce.api/cart/items",
			{ productId, quantity },
			{ headers: { Authorization: `Bearer ${process.env.SF_TOKEN}` } }
		);

		res.json({
			success: true,
			cart: response.data
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to add item to cart" });
	}
});

export default router;
