const express = require('express')
const {sellerSignup, sellerLogin, addProduct} = require('../controller/seller.controller')

const router = express.Router()

router.post('/signup', sellerSignup)
router.post('/login', sellerLogin)
router.post('/addproduct', addProduct)

module.exports = router