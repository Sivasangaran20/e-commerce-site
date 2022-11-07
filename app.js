const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path')
const cookieParser = require('cookie-parser');

const app = express();
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const connectDB = require('./config/db')
dotenv.config();

connectDB();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());


app.use('/',indexRoute);
app.use('/auth',authRoute);
app.use('/users',userRoute);
app.use('/users/products',productRoute);
app.use('/users/cart',cartRoute);
app.use('/users/orders',orderRoute);


app.listen(process.env.PORT, (req, res) => {
    console.log('server started');
})