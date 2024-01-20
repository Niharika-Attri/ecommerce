// const productModel = require('../model/product.model')

// const addProduct = async (req, res) => {
//     const data = req.body;

//     const existingProduct = await productModel.findOne({
//         name: data.name,
//         price: data.price
//     })

//     if(!existingProduct){
//         try{
//             const newProduct = await addProduct.create(data)
//             newProduct.save();
//             res.status(200).json({
//                 message: "new product added"
//             })
//         }catch(err){
//             res.status(500).json({
//                 message: "action failed",
//                 error: err
//             })
//         }
//     }else{
//         res.status(400).json({
//             message: "product with same price exists"
//         })
//     }

    

// }