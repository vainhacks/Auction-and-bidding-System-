const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuctionSchema =  new Schema({
    title: {
        type: String, 
        required: true
        },
    category:{
        type: String, 
        required: true
    },
    description:{
        type: String,
        required: true
    },
    
    image:{
        type: String,
        required: false
    },
    items: [{

        type: Schema.Types.ObjectId,
        ref: 'Item' // Name of the model you are referring to
        
    }],
    startingDateTime: {
        type: Date, // Use the Date type for date and time
        required: true
    },
    location:{
        type: String,
        required: true
        
    },
    registeredBidder: [{ 
        type: Schema.Types.ObjectId,
         ref: "Bidder" }],
         
    registeredUsers: [{ 
        type: Schema.Types.ObjectId,
         ref: "Seller" }],


});

const Auction = mongoose.model("Auction",AuctionSchema);
module.exports = Auction;






    