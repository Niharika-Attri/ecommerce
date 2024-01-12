const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.ObjectId
    },
    image:{

    }
    
})

const productModel = new mongoose.model('product', productSchema)
module.exports = productModel;