const customerModel = require('../model/customer.model')
const productModel = require('../model/product.model')
const cartModel = require('../model/cart.model')
const orderModel = require('../model/order.model')
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
    if(!email || !password){
        res.status(401).json({
            message: 'please provide email and password'
        })
        return
    }

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
            return
        }
        
        // compare password if email registered
        const passwordMatch = await bcrypt.compare(password, existingUser.password)

        // if doesn't match
        if(!passwordMatch){
            res.status(401).json({
                message: 'authentication failed'
            })
            return
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

module.exports = {customerSignup, customerlogin, verifyToken}