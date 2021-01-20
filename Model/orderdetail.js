const mongoose=require('mongoose')
const validator=require('validator')

const OrderdetailSchema=mongoose.Schema({

     order:[{
                item: String,
                quantity:Number,
                userid:String
     }] ,


    id: {
       type:String,
        required: true
      },
    
     TotalQuantity:{
         type:Number,
         required:true
     } ,
    DeliveryCost:{
         type:Number,
         require:true
    },
    GrandTotal:{
        type:Number,
        require:true
    }
   
})
 const  Orderdetail =mongoose.model('orderdetail',OrderdetailSchema)
module.exports=Orderdetail;
