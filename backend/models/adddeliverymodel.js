const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adddeliverySchema = new Schema({

    dDate : {
        type : String,
        required:true
    },
    dTime : {
        type : String,
        required:true
    },
    dStates : {
        type : String,
        required:true

    }
    
    
    

})

const adddelivery = mongoose.model("adddelivery",adddeliverySchema);

module.exports = adddelivery;