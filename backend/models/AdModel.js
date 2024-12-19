const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adSchema = new Schema({
    image: {
        type: String,
        required: true
    },

    date:{
        type: Date,
        required: true
    },

    title:{
        type: String,
        required:true
    },

    description: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model(
    "AdModel",
    adSchema
)