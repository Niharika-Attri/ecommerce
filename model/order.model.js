const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    address: {
        type: String, 
        required: true
    },
    products: [{
        type: mongoose.Schema.ObjectId,
        ref: 'cart'
    }],
    orderedOn: {
        type: Date
    },
    deliveryDate: {
        type: Date
    }
})

const orderModel = new mongoose.model('order', orderSchema)

module.exports = orderModel