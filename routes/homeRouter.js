const express = require('express');

const router = express.Router();

router.get('/home', async (req, res) => {
    try {
        res.render('pages/home');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error'});
    }
});

router.get('/profile', async (req, res) => {
    try {
        const user = req.session.user;
        res.render('pages/profile', {user});
    } catch (error) {
        console.error();
        res.status(500).json({ error: 'server error' });
    }
});

module.exports = router;