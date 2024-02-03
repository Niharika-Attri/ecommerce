const express = require('express')
const {customerSignup, customerlogin, addToCart, removeFromCart,viewcart, verifyToken} = require('../controller/customer.controller')


const router = express.Router()

router.post('/signup', customerSignup)
router.post('/login', customerlogin)
router.get('/cart/:id',viewcart)
router.post('/cart/add/:id',verifyToken, addToCart)
router.post('/cart/remove/:id',verifyToken, removeFromCart)

module.exports = router