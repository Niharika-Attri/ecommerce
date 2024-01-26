const productModel = require('../model/product.model') 

// view all products
const viewAll = async(req, res) => {
    try{
        const products = await productModel.find({})
        res.status(200).json(products)
    }catch(err){
        res.status(500).json({
            error: err.stack,
            message: 'internal server error'
        })
    }
    
}
// view specific product
// sort by price
// filter 
module.exports = {viewAll}