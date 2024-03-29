const express = require('express')
const {addToCart, removeFromCart, viewCart, verifyToken,placeOrder} = require('../controller/cart.controller')

const router = express.Router()

router.get('/:id',viewCart)
router.post('/add/:id',verifyToken, addToCart)
router.post('/remove/:id',verifyToken, removeFromCart)
router.post('/placeorder/:id', placeOrder)

module.exports = router