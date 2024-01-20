const sellerModel = require('../model/seller.model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const productModel = require('../model/product.model')
require('dotenv').config();

cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

const sellerSignup = async (req, res) => {
    const data = req.body

    if(!data.name || !data.email || !data.password){
        res.status(400).json({
            message: 'please provide name, email and password'
        })
        return
    }

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

const sellerLogin = async (req, res) => {
    const data = req.body;

    try{
            
        const existingUser = await sellerModel.findOne({
            email: data.email
        })

        console.log(data);

        if(!existingUser){
            res.status(400).json({
                message: 'email not registered, please sign in '
            })
        }

        console.log(existingUser);

        const passwordMatch = await bcrypt.compare(data.password, existingUser.password)
        if(!passwordMatch){
            res.status(401).json({
                message: 'authentication failed'
            })
        }

        const token = jwt.sign({sellerId:existingUser._id}, 'authsystem', {expiresIn: '1h'})
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

var cloudinaryUrl

const uploadImage = async(imgUrl) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true
    }
    try{
        const result = await cloudinary.uploader.upload(imgUrl, options)
        console.log(result);
        cloudinaryUrl = result.url
        
    }catch(err){
        console.log("error" + err);
    }   
}

const addProduct = async(req, res) => {
    const data = req.body
    const imageUrl = data.image;

    const existingProduct = await productModel.findOne({
        name: data.name,
        price: data.price
    })

    if(!existingProduct){
        try{
            uploadImage(imageUrl)

        const newProduct = new productModel({
            name: data.name,
            price: data.price,
            description: data.description,
            category: data.category,
            image: cloudinaryUrl
        })

        await newProduct.save()
        res.status(200).json({
            message:'new product added'
        })
        }catch(err){
            res.status(500).json({
                error: err
            })
        }
        
    }else{
        res.status(400).json({
            message: 'Product with same price already exists'
        })
    }

    


}
module.exports = {sellerSignup, sellerLogin, addProduct}