const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'customer'
    },
    products: [{
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    }]
})

const cartModel = new mongoose.model('cart', cartSchema)

module.exports =  cartModel