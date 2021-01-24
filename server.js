const express=require('express')
const app=express()
const cors = require ('cors');
const bodyParser=require('body-parser')
app.use(express.json())
require('./db')

app.use(cors());

const UserController=require ('./controller/user')
const ProductController=require('./controller/product')
//const CartController=require('./controller/cart')

// const dotenv = require("dotenv");
// dotenv.config();


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
});

//app.use('/uploads',express.static('uploads'));
//app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({
    extended: false
  }));
//routes
app.use('/user',UserController)
 app.use('/product',ProductController)


 //for deployin purpose
// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static('client/build'));

//     app.get('*',(req,res)=>{
//         res.sendFile(path.resolve(__dirname, 'client','build','index.html'))
//     });
// }
 const port =  process.env.PORT || 3005
 

app.listen(port,()=>{
    console.log('server is running on port 3005')
})


