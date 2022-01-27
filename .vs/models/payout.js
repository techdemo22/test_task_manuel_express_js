var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var PayoutSchema = new Schema(
  {
    firstName: { type: String  },
    lastName: { type: String },
    email: { type: String },

    sessionDetails: { type: String},
    sessionTime: { type: String},

    counsellorId: { type: String },

    isPaid:{ type: String , default: "Not Paid"},
    status:{ type: String , default: "Pending"},

    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var Payout = mongoose.model("Payout", PayoutSchema);
module.exports = Payout;
