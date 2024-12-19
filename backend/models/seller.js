const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sellerSchema = new Schema({
    firstName:  {
        type: String, 
        required: true
    },
    lastName:  {
        type: String, 
        required: true
    },
    email:  {
        type: String, 
        required: true,
        unique:true
    },
    username:  {
        type: String, 
        required: true,
        unique:true
    },
    password:  {
        type: String, 
        required: true
    },
    country:  {
        type: String, 
        required: false
    },
    address:  {
        type: String, 
        required: true
    },
    companyName:  {
        type: String, 
        required: false
    },
    businessAddress:  {
        type: String, 
        required: false
    },
    contactInfo:  {
        type: String, 
        required: true,
        unique:true
    },
    paymentMethod:  {
        type: String, 
        required: true
    },
    
    birthday: {
        type: Date, 
        required: true
    },
    

});

const Seller = mongoose.model("Seller",sellerSchema);
module.exports = Seller;