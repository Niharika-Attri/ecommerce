const sellerModel = require('../model/seller.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const productModel = require('../model/product.model');
const customerModel = require('../model/customer.model');
require('dotenv').config();

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

// seller signup
const sellerSignup = async (req, res) => {
    const data = req.body

    if(!data.name || !data.email || !data.password){
        res.status(400).json({
            message: 'please provide name, email and password'
        })
        return
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(data.password, 8)

    // if user exists
    const existingUser = await sellerModel.findOne({
        email: data.email
    })

    // new user if doesn't already exist
    if(!existingUser){
        try{
            const newSeller = new sellerModel({
                name: data.name,
                email: data.email,
                password:hashedPassword
            })
            // saving new user
            await newSeller.save()
            res.status(400).json({
                message:'User signed in successfully'
            })
        }catch(err){
            res.status(500).json({
                error: err.stack,
                message: 'Sign up failed'
            })
        }
    }else{
        res.status(400).json({
            message: 'email already registered, please login'
        })
    }

}

// seller login
const sellerLogin = async (req, res) => {
    const data = req.body;

    if(!data.email || !data.password){
        res.status(400).json({
            message:'please provide email and password'
        })
    }

    try{
        // if user exists 
        const existingUser = await sellerModel.findOne({
            email: data.email
        })

        if(!existingUser){
            res.status(400).json({
                message: 'email not registered, please sign in '
            })
        }

        // comparing password
        const passwordMatch = await bcrypt.compare(data.password, existingUser.password)
        if(!passwordMatch){
            res.status(401).json({
                message: 'authentication failed'
            })
        }

        // assigning token
        const token = jwt.sign({seller:existingUser}, 'authsystem', {expiresIn: '1h'})
        res.status(200).json({
            token,
            message: 'Successfully logged in'
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

var cloudinaryUrl

// upload image to cloudinary
const uploadImage = async(imgUrl) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
    }
    try{
        const result = await cloudinary.uploader.upload(imgUrl, options)
        cloudinaryUrl = result.url
        
    }catch(err){
         console.log("error uploading image to cloudinary" + err);
    }   
}

// add new product/
var savedId
const addProduct = async(req, res) => {
    const data = req.body
    const imageUrl = data.image;

    // if data provided
    if(!data.name || !data.price || !data.description || !data.category || !data.image){
        res.status(400).json({
            message: 'please provide name, price, description, category and image'
        })
    }

    // if product exists
    const existingProduct = await productModel.findOne({
        name: data.name,
        price: data.price
    })

    if(!existingProduct){
        try{
            // upload image
            await uploadImage(imageUrl)

            // new product
            const newProduct = new productModel({
                name: data.name,
                price: data.price,
                description: data.description,
                category: data.category,
                image: cloudinaryUrl
            })

            // saving new product
            try{
                const savedDocument = await newProduct.save();
                savedId = savedDocument._id;
                console.log('saved document Id:', savedId);
            }catch(error){
                res.status(400).json({error: error.stack, message: 'error saving document'})
                console.log('error saving document', error);
            }

            // adding new product to seller
            const productId = savedId
            const sellerId = decoded.seller._id
            try{
                const existingSeller = await sellerModel.findOne({
                    _id: sellerId
                })
                existingSeller.products.push(productId)
                await existingSeller.save()
                res.status(200).json({
                    message:'new product added'
                })
            }catch(err){
                res.status(500).json({
                    message: 'error adding product to seller',
                    error: err.stack
                })
            }
            
        }catch(err){
            res.status(500).json({
                error: err.stack,
                message: 'internal server error'
            })
        }
        
    }else{
        res.status(400).json({
            message: 'Product with same price already exists'
        })
    }
}

// const deleteProduct


module.exports = {sellerSignup, sellerLogin, addProduct, verifyToken}