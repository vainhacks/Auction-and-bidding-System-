const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidderSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },

  birthday: {
    type: Date,
    required: true,
  },
});

const Bidder = mongoose.model("Bidder", bidderSchema);
module.exports = Bidder;
