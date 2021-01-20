const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;
const CartSchema =new mongoose.Schema({
    productId: {
        type: ObjectId,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    status: {
        type: String,
        default: 'A'
    },
    createOn: {
        type: Date,
        default: new Date()
    },
    modifiedOn: {
        type: Date
    }
})


const  Cart =mongoose.model('Cart',CartSchema)
module.exports = Cart