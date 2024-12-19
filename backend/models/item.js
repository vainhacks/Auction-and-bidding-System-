
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ItemSchema  = new Schema({

    name: {
        type: String, 
        required: true
    },
    startingPrice: {
        type: Number, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
   
    category: {
        type: String, 
        required: true
    },
    brand: {
        type: String,
        required: false
    },
    features: {
        type: String,
        required: false
    },
    material: {
        type: String,
        required: false
    },
    auction: mongoose.Schema.Types.ObjectId,
    condition:{
        type: String,
        required: false
    },
    images: [
        {
          data: Buffer, // Store image data as binary
          contentType: String // Store the image content type (e.g., 'image/jpeg')
        }
      ],
      registeredSeller: [{ 
        type: Schema.Types.ObjectId,
         ref: "Seller" }],
      
    }, 
    {
      timestamps: true, 
    // seller:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }

    
    });

    const Item = mongoose.model("Item",ItemSchema);
    module.exports = Item;
