const productModel = require('../model/product.model') 

// view all products
const viewAll = async(req, res) => {
    try{
        // pagination and sort
        const page = parseInt(req.query.page)-1||0;
        const limit = parseInt(req.query.limit) || 5;
        let sort = req.query.sort || "price"
        // const products = await productModel.find({})
        // res.status(200).json(products)
        req.query.sort?(sort = req.query.sort.toString().split(",")):(sort = [sort])
        let sortBy = {}
        if(sort[1]){
            sortBy[sort[0]] = sort[1]
        }else{
            sortBy[sort[0]] = "asc"
        }

        // let queryObj = {...req.query};
        let products = await productModel.find({})
            .sort(sortBy)
            .skip(page*limit)
            .limit(limit)

        if(products.length == 0){
            res.status(400).json({
                message:"no products found"
            })
            return
        }

        res.status(200).json({
            page: page + 1,
            limit,
            products
        })
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy)
        // }else{
        //     query
        // }
        // const product = await query;

        
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