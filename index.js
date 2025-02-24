require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2/promise');
const MySQLStore = require('express-mysql-session')(session);

const auth = require('./middlware/auth');

const authRouter = require('./routes/authRouter');
const homeRouter = require('./routes/homeRouter');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
const productRouter = require('./routes/productRouter');

const app = express();

const PORT = process.env.PORT || 7000;

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'shop'
});
const sessionStore = new MySQLStore({}, db);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    req.db = db;
    next();
})

app.use('/', authRouter);
app.use('/', auth, homeRouter);
app.use('/users', auth, userRouter);
app.use('/orders', auth, orderRouter);
app.use('/products', auth, productRouter);

app.use((req, res, next) => {
    res.render('pages/next');
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});