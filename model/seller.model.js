const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    }]
})

const sellerModel = new mongoose.model('seller', sellerSchema)

module.exports = sellerModel