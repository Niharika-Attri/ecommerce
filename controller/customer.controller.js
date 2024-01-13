const customerModel = require('../model/customer.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const customerSignup = async (req,res) => {
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
}

const customerlogin = async(req, res) => {
    const data = req.body

    const email = data.email
    const password = data.password

    try{
        const existingUser = await customerModel.findOne({
            email: email 
        })
    
        if(!existingUser){
            res.status(400).json({
                message: 'email not registered, please sign in'
            })
        }
    
        const passwordMatch = await bcrypt.compare(password, existingUser.password)
        if(!passwordMatch){
            res.status(401).json({
                message: 'authentication failed'
            })
        }
    
        const token = jwt.sign({customerId: existingUser._id}, 'authsystem', {expiresIn: '1h'})
        res.status(200).json({
            token, 
            message:'Successfully logged in '
        })
    }catch(err){
        res.status(500).json({
            message: 'login failed',
            error: err
        })
    }
    
}

module.exports = {customerSignup, customerlogin}