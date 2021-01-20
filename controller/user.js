const express=require('express')
const router=express.Router()
const bodyParser=require('body-parser')
const User= require("../Model/user");
const Product= require("../Model/product");
const Order= require("../Model/orderlist");
const Orderdetail= require("../Model/orderdetail");
const auth = require("../authenticate/auth");
router.use(express.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json())

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

router.post('/signup',async(req,res,next)=>{
     const email = req.body.email;
     let password = req.body.password;
     const fullName = req.body.fullName;
     const contact = req.body.contact;
     const address = req.body.address;
      try{
     const existingUser = await User.find({email:req.body.email})
        // if(existingUser===null || existingUser===undefined){
          if(existingUser.length==0){
              bcrypt.hash(password,10,async(err,hash)=>{
                  if(err){
                res.status(500).send({status:'failed',
                message:err})
            }else{
                      const user = new User({
                           email:email,
                           password:hash,
                           fullName:fullName,
                           contact:contact,
                           address:address,
                           role:req.body.role
                      })
                      await user.save();
                      const id = user._id;
                      const token = jwt.sign(id.toString(),'thisismyfinalproject');
                     res.status(201).send({data:user,token:token,status:'success',message:"Registration successful"})
            }
              })
         }else{
             res.status(401).send({status:'failed',message:"Email already Exist"})
         }
      }catch(err){
        res.status(401).send({status:'failed',message:err})
      }
    

}) 

router.post('/signin',async(req,res)=>{
  // let email = req.body.email;
  // let password = req.body.password;
  let {email,password} = req.body;
  let  existingUser = await User.find({email:email});
        if(existingUser.length===1){
              bcrypt.compare(password,existingUser[0].password,(error,result)=>{
          if(!result){
            res.status(401).send({status:'failed',message:'type password again'})
           
          }
           if(result){
             const id = existingUser[0]._id;
             const token = jwt.sign(id.toString(),'thisismyfinalproject');
             res.status(200).send({data:existingUser[0],token:token,status:'success',message:"Login successful"})
                     console.log(res.token);
            }
         
      })
    
     }else if(existingUser.length===0){
      res.status(401).send({status:'failed',message:'Login Failed'});
     }
})

router.get('/',auth,async(req,res)=>{
      const id = req.userData;
      try{
      const user = await User.findById(id);
      res.status(200).send({data:user,status:'success'})
      }catch(err){
        res.status(401).send({status:'failed',message:'please login again'});
      }
})

router.get('/alluser',(req,res)=>{
  User.find({role:"User"}, (err, result) => {
        if (err) {
            res.status(401).json({ status: 'failed', message: err });
        }
        else {
            res.status(200).send({ status: 'success', message: 'All User Found!', data: result });
        }
    });
})

router.delete('/:id',async(req,res)=>{
     try{
       const id = req.params.id;
       await User.deleteOne({_id:id});
       res.json({ status: 'success', message: ' User Deleted!'});
     }catch(err){
      res.status(401).json({ status: 'failed', message: err });
     }
})

router.put('/',auth,async(req,res)=>{
     const id = req.userData;
     const body = req.body;
     try{
       const result = await User.updateOne({_id:id},body);
       res.status(200).send({ status: 'success', message: 'Updated', data: result });
     }catch(err){
      res.status(401).send({ status: 'failed', message: err });
     }
})

router.post('/orderlist',auth,async(req,res)=>{
  console.log(req.userData);
  const {item,quantity}  = req.body;
 // const product = await Product.find({productName:{$regex:item,'$options':'i'}})
 const product = await Product.find({productName:item});
 const productid = product[0]._id
  try{
   const order = new Order( {
       item : item,
       quantity : quantity,
       userid : req.userData,
       productid:  productid
   })
    
    await order.save();
      res.status(201).send({status:"success",message:"product added to orderlist"})
   }
     catch(err) {
       res.status(401).send({ status: 'failed', message: 'please authenticate' });
     }    
})



    router.post('/orderdetail/:id',async(req,res,next)=>{
      try{
      const ids = req.params.id
       let totalquantity = 0;
       let total = 0;
      let order =  await Order.find({userid:ids});     
                  console.log(order.length);
                  
                    for(let ordr of order){
                      totalquantity= totalquantity + (ordr.quantity);
                     
                        const products =   await Product.findById(ordr.productid);

                         let quantityavailable = products.quantityavailable
                         let body = {"quantityavailable":(quantityavailable-ordr.quantity)}
                         const updatequantity = await Product.updateOne({_id:ordr.productid},body);


                           let ttotal = 0;
                           ttotal = ((ordr.quantity)*(products.price));
                         
                           let tax = (products.tax);
                           const additionaltax = ((tax/100)*ttotal);
                                ttotal = ttotal + additionaltax;
                               total = total + ttotal;
                           }
                    
                const Deliverycost = Number(req.body.Deliverycost);
                const final = total + Deliverycost;  
                const orderdetail = new Orderdetail({
                        order:order,
                        TotalQuantity : totalquantity,
                        DeliveryCost: Deliverycost,
                        id:ids,
                        GrandTotal:final
       })

      
      await orderdetail.save();
      res.status(201).send({status:"success",message:"ordere detail", orderdetail:orderdetail})
      }catch(err){
        console.log(err);
        res.status(401).send({ status: 'failed', message: 'please authenticate' });
      } 
    })
        //orderdetail for admin
 router.get('/getorderdetail/:id',async(req,res)=>{
  
          let ids = req.params.id;
       const detail = await Orderdetail.find({id:ids});
       res.status(201).send({status:"success",message:"ordere detail", orderdetail:detail})
       
  
      })
 //orderdetail for user
 router.get('/getorderdetail',auth,async(req,res,next)=>{
        const id = req.userData;
        const detail = await Orderdetail.find({id:id});
        res.status(201).send({status:"success",message:"ordere detail", orderdetail:detail})
 })

    //for admin to get all order list of specific user
    router.get('/getallorder/:id',async(req,res)=>{
           const id = req.params.id;
           const order = await Order.find({userid:id});
       res.status(201).send({status:"success",message:"ordere detail", order:order});
    })

//for user of getting their order
router.get('/getorder',auth,async(req,res)=>{
          const data = await Order.find({userid:req.userData});
          res.status(200).send({status:"success",message:"ordered product",order:data});

})



router.delete('/deleteorder/:id',async(req,res)=>{
  try{
    const id = req.params.id;
    await Order.deleteOne({_id:id});
    res.status(200).send({ status: 'success', message: ' Order Deleted!'});
  }catch(err){
   res.status(401).json({ status: 'failed', message: err });
  }
})

 router.get('/getprofit',async(req,res)=>{
      
    const user = await User.find();
    const totaluser = user.length-1;

    const order = await Order.find();
    const totalorder = order.length;

    const orderdetails = await Orderdetail.find();
    const totalorderdetail  = orderdetails.length;
    
   let totaldeliverycost = 0;
   let totalcost = 0;
   let tprofit = 0
    for(let orderdetail of orderdetails){
      //  console.log(orderdetail)
      totaldeliverycost = totaldeliverycost + orderdetail.DeliveryCost;
      totalcost = totalcost + orderdetail.GrandTotal;
       const order =  orderdetail.order;
      // console.log(order);
       for (let ordr of order){
            const item = ordr.item;
             const quantity = ordr.quantity;
            const product  = await Product.find({productName:item});
           // console.log(product);
           const price = product[0].price;
           const tprice = price*quantity;
             const profit  = product[0].profit;
               tprofit = tprofit + (profit/100)*tprice;

       }
 }
            let data = {
         "totaluser" :  totaluser,
         "totalorder" : totalorder,
         "totalorderdetail" :totalorderdetail,
         "totaldeliverycost" : totaldeliverycost ,
         "totalcost": totalcost,
         "tprofit" : tprofit
       }
       res.status(200).send({status:"success",message:"profit gained",profit:data});
 })




module.exports=router;