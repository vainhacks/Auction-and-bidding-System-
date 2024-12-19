//Shipping provider details
const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const rgisterSchema = new Schema({

    fname : {
        type : String,
        required:true
    },
    lname : {
        type : String,
        required:true
    },
    email : {
        type : String,
        required:true

    },
    number : {
        type : Number,
        required:true
    },
    password : {
        type : String,
        required:true
    },
    
    street : {
        type : String,
        required:true
    },city : {
        type : String,
        required:true
    },nic : {
        type : String,
        required:true
    },dlisen : {
        type : String,
        required:true
    }
    

})


const Register = mongoose.model("Register",rgisterSchema);

module.exports = Register;