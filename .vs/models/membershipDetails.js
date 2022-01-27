var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var crypto = require("crypto");
var secret = require("../config/secret");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var membershipSchema = new Schema(
  {
    family: { type: String, default: null },
    single: { type: String, default: null },
    mostPopular:  { type: String, default: null },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },    
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

var membershipDetails = mongoose.model("membershipDetails", membershipSchema);
module.exports = membershipDetails;
