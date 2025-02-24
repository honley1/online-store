const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    let conn;
    try {
        const db = req.db;
        const user = req.session.user;

        conn = await db.getConnection();

        const [orders] = await conn.execute('SELECT * FROM orders WHERE user_id = ?', [user.id]);

        let productIds = [];
        let products = [];

        let i = 0;
        for (const order of orders) {
            const [products] = await conn.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

            productIds.push(...products.map(p => p.id));
            i++;
        }

        for (const productId of productIds) {
            const [product] = await conn.execute('SELECT * FROM products WHERE id = ?', [productId]);

            products.push(...product);
        }
        
        return res.render('pages/orders', { orders, products });;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;