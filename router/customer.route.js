const express = require('express')
const {customerSignup, customerlogin, addToCart, removeFromCart,viewcart, verifyToken} = require('../controller/customer.controller')


const router = express.Router()

router.post('/signup', customerSignup)
router.post('/login', customerlogin)

module.exports = router