const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2;
const customerRouter = require('./router/customer.route')
const sellerRouter = require('./router/seller.route')
const productRouter = require('./router/product.route');
const cartRouter = require('./router/cart.route')
const cartModel = require('./model/cart.model');
require('dotenv').config();

// cloudinary.config({
//     secure: true,
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.CLOUD_KEY,
//     api_secret: process.env.CLOUD_SECRET
// })

// console.log(cloudinary.config());

const app = express();

mongoose.connect(process.env.mongodbURI)
    .then( app.listen(3000, () => {
        console.log('Connected to database');
        console.log('Server running on port 3000');
    }))
    .catch((err) => {console.log(err);})

app.use(express.json())

app.use(morgan('dev'))

app.use('/customer', customerRouter)
app.use('/seller', sellerRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)
// app.use((req, res) => {
//     res.status(404).json({
//         message: 'page not found'
//     })
// })
