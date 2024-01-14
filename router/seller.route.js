const express = require('express')
const {sellerSignup} = require('../controller/seller.controller')

const router = express.Router()

router.post('/signup', sellerSignup)

module.exports = router