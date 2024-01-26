const express = require('express')
const {viewAll} = require('../controller/product.controller')

const router = express.Router()

router.get('/viewall', viewAll)

module.exports = router