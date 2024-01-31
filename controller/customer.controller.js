const customerModel = require('../model/customer.model')
const productModel = require('../model/product.model')
const cartModel = require('../model/cart.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// signup
const customerSignup = async (req,res) => {
    const data = req.body;

    // if provided
    if( !data.email|| !data.name || !data.password){
        res.status(400).json({
            message: 'please enter name, email and password'
        })
        return
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(data.password, 8);

    // if already exists
    const existingUser = await customerModel.findOne({
        email: data.email,
        name: data.name
    })


    if(!existingUser){
        try{
            // create new if doesn't exist
            const newCustomer = new customerModel({
                email: data.email,
                name: data.name,
                password: hashedPassword,
            })
            // save
            await newCustomer.save()
            res.status(200).json({
                message:'User signed in'
            })
            return 
        }catch(err){
            res.status(500)({
                error : err.stack
            })
        }
    // if exists
    }else{
        res.status(400).json({
            message: 'User already exists'
        })
    }
}

// login
const customerlogin = async(req, res) => {
    const data = req.body

    const email = data.email
    const password = data.password

    try{
        // check if registered
        const existingUser = await customerModel.findOne({
            email: email 
        })
    
        // if not registered
        if(!existingUser){
            res.status(400).json({
                message: 'email not registered, please sign in'
            })
        }
        
        // compare password if email registered
        const passwordMatch = await bcrypt.compare(password, existingUser.password)

        // if doesn't match
        if(!passwordMatch){
            res.status(401).json({
                message: 'authentication failed'
            })
        }
    
        // provide token if matches
        const token = jwt.sign({customer: existingUser}, 'authsystem', {expiresIn: '1h'})
        res.status(200).json({
            token, 
            message:'Successfully logged in '
        })
    }catch(err){
        res.status(500).json({
            message: 'login failed',
            error: err.stack
        })
    }
    
}

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
module.exports = {customerSignup, customerlogin, addToCart, verifyToken}