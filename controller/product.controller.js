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

    // sort by price
}
// view specific product
const singleProduct = async(req, res) => {
    const id = req.params.id

    try{
        const product = await productModel.findById(id);
        if(!product){
            res.status(404).json({
                message: "product not found"
            })
            return
        }
        res.status(200).json({
            message: "successfully recieved product by productId",
            product: product
        })
    }catch(err){
        res.status(500).json({
            error: err.stack,
            message: "internal server error"
        })
    }
}

// filter 
module.exports = {viewAll, singleProduct}