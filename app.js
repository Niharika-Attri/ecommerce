const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const customerModel = require('./model/customer.model')
require('dotenv').config();

const app = express();

mongoose.connect(process.env.mongodbURI)
    .then( app.listen(3000, () => {
        console.log('Connected to database');
        console.log('Server running on port 3000');
    }))
    .catch((err) => {console.log(err);})

app.use(express.json())

app.use(morgan('dev'))

app.post('/customerSignup', async (req,res) => {
    const data = req.body;

    if( !data.email|| !data.name || !data.password){
        res.status(400).json({
            message: 'please enter name, email and password'
        })
        return
    }

    const hashedPassword = await bcrypt.hash(data.password, 8);

    const existingUser = await customerModel.findOne({
        email: data.email,
        name: data.name
    })

    if(!existingUser){
        try{
            const newCustomer = new customerModel({
                email: data.email,
                name: data.name,
                password: hashedPassword,
            })
            await newCustomer.save()
            res.status(200).json({
                message:'User signed in'
            })
            return 
        }catch(err){
            res.status(500)({
                error : err
            })
        }
    }else{
        res.status(400).json({
            message: 'User already exists'
        })
    }
})
