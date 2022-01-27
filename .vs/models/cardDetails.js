var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var cardSchema = new Schema(
  {
    cardHolderId: { type: String, default: null },
    nameOnCredit: { type: String, default: null },
    month: { type: String, default: null },
    year: { type: String, default: null },
    role: {
      type: Number,
      enum: [1, 2, 3, 4], //Admin 1, Councellor 2, Parent 3, child 4 
      default: 3
    },
    cardNumber: { type: String, default: null },
    cvv: { type: String, default: null },
    isDeleted: { type: Boolean, default: false },    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var cardDetails = mongoose.model("cardDetails", cardSchema);
module.exports = cardDetails;
