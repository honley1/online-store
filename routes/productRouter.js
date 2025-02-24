const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    let conn;
    try {
        const db = req.db;

        conn = await db.getConnection();

        const [rows] = await conn.execute('SELECT * FROM products');

        return res.render('pages/products', {products: rows});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;