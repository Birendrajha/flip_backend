const mongoose=require('mongoose')
const validator=require('validator')

const ProductSchema=mongoose.Schema({
    productName: {
        type: String,
        required: true,
       
        
    },
   
    description: {
        type: String,
        required: true,
        
    },
   
    price: {
        type: Number,
        required: true
    },

    quantityavailable:{
        type:Number,
        required:true      

    },

    profit: {
          type:Number,
          required:true
    },
    tax:{
        type:Number,
        required:true
    },
    outOfStock: {
        type: Boolean,
        default: false,
        required:true
    }
})
const Product=mongoose.model('products',ProductSchema)
module.exports=Product;