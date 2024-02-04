const mongoose = require('mongoose')
const customerModel = require('../model/customer.model')
const cartModel = require('../model/cart.model')
const jwt = require('jsonwebtoken')

// verify token
var decoded
function verifyToken(req, res, next){
    const token = req.header('Authorization')

    // if token not provided
    if(!token){
        res.status(401).json({
            message:'access denied, please signup or login'
        })
    }

    // verifying token
    try{
        // secret key
        decoded = jwt.verify(token,'authsystem' )
        console.log('authorized', decoded);
        next();
    }catch(err){
        res.status(401).json({
            error: 'invalid token'
        })
    }
}

// addtocart
const addToCart = async( req, res) =>{
    const productId = req.params.id

    // if product exists
    const existingProduct = await productModel.findOne({
        _id: productId
    })

    // if doesn't exist
    if(!existingProduct){
        res.status(404).json({
            message: 'product not found'
        })
    }

    const customer = decoded.customer

    // if cart alredy created
    var existingCart = await cartModel.findOne({
        customer: customer
    })

    // if doesn't exist
    if(!existingCart){
        try{
            // new cart
            const newCart = new cartModel({
                customer: customer._id
            })
            try{
                // save new cart
                const savedCart = await newCart.save()
                savedId = savedCart._id
                console.log('saved cart id: ', savedId)

                existingCart = savedCart
            }catch(err){
                res.status(400).json({
                    message: 'error saving the document',
                    error: err.stack
                })
            }
        }catch(err){
            res.status(500).json({
                message: 'internal server error',
                error: err.stack
            })
        }
    }
    // pushing product in cart
    try{
        existingCart.products.push(productId)
        existingCart.save()
        res.status(200).json({
            message: 'product successfully added to cart'
        })
    }catch(err){
        res.status(401).json({
            message: 'error adding product to cart',
            error: err.stack
        })  
    }
    console.log(object);
}

// remove from cart
const removeFromCart = async(req, res) => {
    const productId = req.params.id

    // if product exists
    const existingProduct = await productModel.findOne({
        _id: productId
    })

    // if doesn't exist
    if(!existingProduct){
        res.status(400).json({
            message: 'product not found'
        })
        return
    }

    const customer = decoded.customer

    // if cart exists
    const existingCart = await cartModel.findOne({
        customer: customer
    })
    
    // if doesn't exist 
    if(!existingCart){
        res.status(400).json({
            message: 'cart not created'
        })
        return
    }

    // if product in cart
    const index = existingCart.products.indexOf(productId)

    // if not in cart
    if( index == -1){
        res.status(400).json({
            message: 'product not in cart'
        })
        return
    }
    // console.log(index);

    try{
        // remove from array
        existingCart.products.splice(index, 1)

        // save document
        existingCart.save()
        res.status(400).json({
            message: 'product removed successfully',
            existingCart: existingCart
        })
    }catch(err){
        res.status(500).json({
            message: 'error saving the document',
            error: err.stack
        })
    }
    
    
}

// view cart
const viewCart = async(req, res) => {
    try{
        const customerId = req.params._id;
        // var objectId = new mongoose.Types.ObjectId(customerId);

        const page = parseInt(req.query.page)-1 || 0;
        const limit = parseInt(req.query.limit) || 4;
        let sort = req.query.sort || "products"
        req.query.sort?(sort = req.query.sort.toString().split(",")):(sort = [sort])
        let sortBy = {}
        if(sort[1]){
            sortBy[sort[0]] = sort[1]
        }else{
            sortBy[sort[0]] = "asc"
        }

        let cart = await cartModel.find({
            // _id: customerId
        })
        // let products = cart.products
            .sort(sortBy)
            .skip(page*limit)
            .limit(limit)
            .populate('products')
        
        // if(cart.length == 0){
        //     res.status(400).json({
        //         message: "no products found"
        //     })
        //     return
        // }
        res.status(200).json({
            page: page + 1,
            limit,
            cart
        })
    }catch(err){
        res.status(500).json({
            message: "internal server error",
            error: err.stack
        })
    }
}

module.exports = {verifyToken, addToCart, removeFromCart, viewCart}