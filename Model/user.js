const mongoose=require('mongoose')
const validator=require('validator')

const UserSchema=mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
   
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // maxlength: 15
    },
    contact: {
        type: String,
        trim: true,
        required: true
    },

  address:{
            type:String,
            required:true
    },
    role: {
        type: String,
        trim: true,
        required: true,
        default: 'User'
    }
})
 const  User =mongoose.model('user',UserSchema)
module.exports=User;


// {
//     "fullName":"sachinjha",
//     "email": "sachinjha1500123@gmail.com",
//     "password":"123456789",
//     "contact":"7477800305",
//     "address" :"delhi"
    
//     }

// {
//     "item" : "laptop",
//     "quantity" :15
// }