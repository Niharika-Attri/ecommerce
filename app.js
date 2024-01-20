const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cloudinary = require('cloudinary').v2;
const customerRouter = require('./router/customer.route')
const sellerRouter = require('./router/seller.route')
require('dotenv').config();

// cloudinary.config({
//     secure: true,
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.CLOUD_KEY,
//     api_secret: process.env.CLOUD_SECRET
// })

// console.log(cloudinary.config());

const app = express();

mongoose.connect(process.env.mongodbURI)
    .then( app.listen(3000, () => {
        console.log('Connected to database');
        console.log('Server running on port 3000');
    }))
    .catch((err) => {console.log(err);})

app.use(express.json())

app.use(morgan('dev'))

app.use('/customer', customerRouter)
app.use('/seller', sellerRouter)

// const uploadImage = async (imagePath) => {
//     const imgPath = 'https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg';
//     const options = {
//         use_filename: true,
//         unique_filename: false,
//         overwrite: true
//     }

//     try{
//         const result = await cloudinary.uploader.upload(imgPath, options);
//         console.log(result);
//         return result.public_id
//     }catch(err){
//         console.log("error:" + err);
//     }
// }

// ( async() => {
//     const imagePath = 'https://cloudinary-devs.github.io/cld-docs-assets/assets/images/happy_people.jpg';
// })

// uploadImage()