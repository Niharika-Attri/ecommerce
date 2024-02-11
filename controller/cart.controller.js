const mongoose = require('mongoose')
const customerModel = require('../model/customer.model')
const productModel = require('../model/product.model')
const cartModel = require('../model/cart.model')
const jwt = require('jsonwebtoken')
const orderModel = require('../model/order.model')

// verify token
var decoded
function verifyToken(req, res, next){
    const token = req.header('Authorization')

    // if token not provided
    if(!token){
        res.status(401).json({
            message:'access denied, please signup or login'
        })
        return
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
        const customerId = req.params.id;
        console.log(customerId);

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

        let cart = await cartModel.findById(customerId)
        // let products = cart.products
            .sort(sortBy)
            .skip(page*limit)
            .limit(limit)
            .populate('products')
        
        if(cart.length == 0){
            res.status(400).json({
                message: "no products found"
            })
            return
        }
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
// clear cart
// async function clearCart(cartId){
//     try{
//         let cart = await cartModel.findById(cartId)
//             .populate('products')
//         const products = cart.products
//         if(!products){
//             res.status(400).json({
//                 message:'cart is empty'
//             })
//             return
//         }
//         res.status(200).json({
//             products,
            
//         })
//     }catch(err){
//         res.status(500).json({
//             message:'internal server error',
//             error: err.stack
//         })
//     }
    
// }

// placeorder
const placeOrder = async(req, res) => {
    if(!req.body.address){
        res.status(400).json({
            message:'please enter address'
        })
        return
    }
    const cartId = req.params.id
    const address = req.body.address
    //date
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    // days for delivery
    const dayDelay = Math.floor(Math.random() * 10) + 1

    const orderedOn = day + '-' + month + '-'+ year
    const deliveryDate = day + dayDelay + '-' + month + '-'+ year
    try{
        // find by id and populate products
        let cart = await cartModel.findById(cartId)
            .populate('products')
        const products = cart.products
        // if no products found
        if(!products){
            res.status(400).json({
                message:'cart is empty'
            })
        }
        // new order
        const newOrder = new orderModel({
            address: address,
            products: products,
            orderedOn: orderedOn,
            deliveryDate: deliveryDate
        })
        try{
            //save order
            const savedOrder = await newOrder.save()
            res.status(200).json({
                message: 'order placed successfully',
                order: savedOrder
                //.populate('products'),
            })
        }catch(err){
            res.status(400).json({
                message: 'error saving the order',
                error: err.stack
            })
        }
        // clearCart
        
    }catch(err){
        res.status(500).json({
            message: 'internal server error',
            error: err.stack
        })
    }
    
}

module.exports = {verifyToken, addToCart, removeFromCart, viewCart, placeOrder}