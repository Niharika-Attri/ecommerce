const express = require('express')
const {sellerSignup, sellerLogin, addProduct, addProducttoSeller, verifyToken} = require('../controller/seller.controller')

const router = express.Router()

router.post('/signup', sellerSignup)
router.post('/login', sellerLogin)
router.post('/addproduct',verifyToken, addProduct)

module.exports = router