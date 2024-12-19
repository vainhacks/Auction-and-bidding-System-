const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adddeliverypersonSchema = new Schema({

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
        type : String,
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

const Adddelivery = mongoose.model("Adddelivery",adddeliverypersonSchema);

module.exports = Adddelivery;