const mongoose=require('mongoose')
const validator=require('validator')

const OrderlistSchema=mongoose.Schema({
    item: {
        type: String,
        required: true
    },
   
    quantity: {
        type: Number,
        required: true
        
    },
    userid: {
        
       //type: mongoose.Schema.Types.ObjectId,
       type:String,
        required: true
       
        
    },
    productid: {
        type:String,
        require:true
    },
    totalcost: {
        type:Number,
        require:true
    }
   
})
 const  Order =mongoose.model('order',OrderlistSchema)
module.exports=Order;
