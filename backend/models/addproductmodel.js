const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addproductSchema = new Schema({

    productname : {
        type : String,
        required:true
    },
    productwight : {
        type : String,
        required:true
    },
    buyermobile : {
        type : Number,
        required:true

    },
    quantity : {
        type : Number,
        required:true
    },
    buyershomeno : {
        type : String,
        required:true
    },
    buyerstreet : {
        type : String,
        required:true
    },
    buyerscity : {
        type : String,
        required:true
    },
    buyersname : {
        type : String,
        required:true
    },
    deliveryPersonId: { // Add this field
        type: String,
        required: true
    }
    
    

})

const Addproduct = mongoose.model("Addproduct",addproductSchema);

module.exports = Addproduct;