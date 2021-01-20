const mongoose = require ('mongoose');
 mongoose.connect('mongodb://127.0.0.1:27017/Flipmart',{
     useNewUrlParser:true,
     useUnifiedTopology:true
 }).then(()=>{
     console.log('connected to mongo');
 }).catch((err)=>{
     console.log('error connecting to mongo',err);
 })