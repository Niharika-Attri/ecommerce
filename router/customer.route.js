const express = require('express')
const {customerSignup, customerlogin, addToCart, verifyToken} = require('../controller/customer.controller')


const router = express.Router()

router.post('/signup', customerSignup)
router.post('/login', customerlogin)
router.post('/addtocart/:id',verifyToken, addToCart)

module.exports = router