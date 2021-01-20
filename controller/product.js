const express=require('express')
const router=express.Router()
const bodyParser=require('body-parser')
const Product= require("../Model/product");

const multer = require("multer");
const  mongoose  = require('mongoose');

router.use(express.json())
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())

// const path = require('path');
// var storage = multer.diskStorage({
// destination: function(req,file,cb){
//     cb(null, path.join(__dirname,'/uploads'));
// },
// filename : function(req,file,cb){
//     // cb(null,new Date().toISOString()+file.originalname)
//     cb(null, Date.now()+file.originalname)
// }
// })

// var fileFilter = (req,file,cb)=>{
//     if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' ||file.mimetype==='image/jpg'){
//         cb(null,true)
//     }else{
//         cb(null,false)
//     }
// }

// var upload = multer({
//     storage:storage,
//     limits:{
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter:fileFilter
// })
//router.post('/add',upload.single('productImage'),async(req,res,next)=>{

router.post('/add',async(req,res,next)=>{
    try{
           const {productName,description,price,tax,profit,quantityavailable} = req.body;
    const  product  = new Product({
        
          productName:productName,
          description:description,
          price:price,
          tax:tax,
          profit:profit,
          quantityavailable:quantityavailable
          })
      
          await product.save();
          res.status(201).send({ status: 'success', message: 'Product Added!', data: product });
       }catch(error){
        
         res.status(400).send({ status: 'failed', message: error })
       }
})


router.get('/getproduct',async(req,res)=>{
  let limit =Number(req.query.limit);
  let offset = Number(req.query.offset);
 
  if(limit==0 || isNaN(limit)){
        limit = 10;
  }
  if(offset==0 || isNaN(offset)){
    offset = 0;
}

        try{
               const product = await Product.find().skip(offset).limit(limit);
             
               res.status(201).send({ status: 'success', message: 'Product in stock!', data: product });

        }catch(err){
              res.status(400).send({ status: 'failed', message: 'something went wrong try again!!' })
        }

})
 
 router.get('/getproductbyid/:id',async(req,res)=>{
        const id = req.params.id;
          const product = await Product.findById(id);
          res.status(201).send({ status: 'success', message: ' Specific product Product!', data: product });
 })


 router.put('/updateproduct/:id',async(req,res)=>{
          const id = req.params.id;
          const body = req.body;
          try{
            const result = await Product.updateOne({_id:id},body);
            res.status(200).send({ status: 'success', message: 'Updated', data: result });
          }catch(err){
           res.status(401).send({ status: 'failed', message: 'something went wrong'   });
          }
 })

 router.delete('/:id',async(req,res)=>{
          const id = req.params.id;
          try{
              await Product.deleteOne({_id:id});
              res.json({ status: 'success', message: ' User Deleted!'});
            }catch(err){
             res.status(401).json({ status: 'failed', message: 'something went wrong' });
            }


 })


module.exports=router;