const express = require('express');
const bcrypt = require('bcryptjs');

const { createUser, getUser } = require('../database/userDatabase');

const router = express.Router();

router.get('/register', async (req, res) => {
    res.render('pages/register', { error: null });
});

router.get('/login', async (req, res) => {
    res.render('pages/login', { error: null });
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.post('/register', async (req, res) => {
    let conn;
    try {
        const db = req.db;

        const { username, password } = req.body;

        if (!username || !password) return res.render('pages/register', { error: 'Missing fields'});

        if (username.length < 4) {
            return res.render('pages/register', { error: "Username must be at least 4 characters long." });
        }
        
        if (username.length > 60) {
            return res.render('pages/register', { error: "Username must not exceed 60 characters." });
        }
        
        if (password.length < 8) {
            return res.render('pages/register', { error: "Password must be at least 8 characters long." });
        }

        conn = await db.getConnection();

        const isUserExist = await getUser(username, conn);

        if (isUserExist) return res.render('pages/register', { error: 'User already exist'});

        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser(username, hashedPassword, conn);

        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'server error' });
    } finally {
        if (conn) conn.release();   
    }
});

router.post('/login', async (req, res) => {
    let conn;
    try {
        const { username, password } = req.body;

        const db = req.db;

        if (!username || !password) return res.render('pages/login', { error: 'Missing fields'});

        if (username.length < 4) {
            return res.render('pages/login', { error: "Username must be at least 4 characters long." });
        }
        
        if (username.length > 60) {
            return res.render('pages/login', { error: "Username must not exceed 60 characters." });
        }
        
        if (password.length < 8) {
            return res.render('pages/login', { error: "Password must be at least 8 characters long." });
        }

        conn = await db.getConnection();

        const user = await getUser(username, conn);

        if (!user) return res.render('pages/login', { error: 'Invalid username or password'});

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.render('pages/login', { error: 'Invalid username or password'});

        req.session.user = { id: user.id, username: user.username, created_at: user.created_at };

        return res.redirect('/home');
    } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'server error' });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router