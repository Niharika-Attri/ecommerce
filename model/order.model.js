const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true 
    },
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