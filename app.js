const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan')
const customerRouter = require('./router/customer.route')
const sellerRouter = require('./router/seller.route')
require('dotenv').config();

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