const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Adminschema = new Schema({
    name:  {
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
    salary:{

        type:Number,
        required:true

    }
    

});

const Admin = mongoose.model("Admin",Adminschema);
module.exports = Admin;