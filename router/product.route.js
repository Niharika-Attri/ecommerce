const express = require('express')
const {viewAll, singleProduct} = require('../controller/product.controller')

const router = express.Router()

router.get('/viewall', viewAll)
router.get('/singleproduct/:id', singleProduct)

module.exports = router