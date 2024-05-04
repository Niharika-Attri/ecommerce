const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        //email validation
        validate: {
            validator: function(v) {
              // Regular expression to validate email
              return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
          }
        },
    password: {
        type: String,
        required: true
    },cart: [{
        type: mongoose.Schema.ObjectId,
        ref: 'product'
    }]
})

const customerModel = new mongoose.model('customer', customerSchema)

module.exports = customerModel;
