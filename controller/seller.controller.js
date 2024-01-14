const sellerModel = require('../model/seller.model');
const bcrypt = require('bcrypt')

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

module.exports = {sellerSignup}