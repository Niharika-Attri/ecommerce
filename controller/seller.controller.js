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

    const existingUser = await sellerModel.findOne({
        email: data.email
    })

    if(!existingUser){
        try{
            const newSeller = new sellerModel({
                name: data.name,
                email: data.email,
                password:hashedPassword
            })
            // saving new seller
            await newSeller.save()
            res.status(400).json({
                message:'User signed in'
            })
        }catch(err){
            res.status(500).json({
                error: err
            })
        }
    }else{
        res.status(400).json({
            message: 'email already registered'
        })
    }

}

// seller login
const sellerLogin = async (req, res) => {
    const data = req.body;

    try{
            
        const existingUser = await sellerModel.findOne({
            email: data.email
        })

        // console.log(data);

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
            error: err
        })
    }
}

// verify token
var decoded
function verifyToken(req, res, next){
    const token = req.header('Authorization')
    if(!token){
        res.status(401).json({
            message:'access denied, please signup or login'
        })
    }
    try{
        // secret key
        decoded = jwt.verify(token,'authsystem' )

        // decoded token
        // decodedseller = decoded
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
        // console.log(result);
        cloudinaryUrl = result.url
        // console.log(cloudinaryUrl);
        
    }catch(err){
         console.log("error uploading image to cloudinary" + err);
    }   
}

// add new product/
var savedId
const addProduct = async(req, res) => {
    const data = req.body
    const imageUrl = data.image;

    const existingProduct = await productModel.findOne({
        name: data.name,
        price: data.price
    })

    if(!existingProduct){
        try{
            await uploadImage(imageUrl)
            const newProduct = new productModel({
                name: data.name,
                price: data.price,
                description: data.description,
                category: data.category,
                image: cloudinaryUrl
            })

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
            console.log("productId: "+ productId,"sellerId:" + sellerId);
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


module.exports = {sellerSignup, sellerLogin, addProduct, verifyToken}